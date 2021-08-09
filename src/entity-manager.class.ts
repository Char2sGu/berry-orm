import { AnyEntity } from "./any-entity.type";
import { BaseEntity } from "./base-entity.class";
import { EntityData } from "./entity-data.type";
import { EntityField } from "./entity-field.type";
import { EntityManagerOptions } from "./entity-manager-options.interface";
import { EntityStore } from "./entity-store.type";
import { PrimaryKeyField } from "./primary-key-field.type";
import { PrimaryKey } from "./primary-key.type";
import { FIELDS, POPULATED, PRIMARY, TYPE } from "./symbols";
import { Type } from "./utils";

export class EntityManager {
  private map = new Map<Type<AnyEntity>, EntityStore<AnyEntity>>();

  constructor({ entities }: EntityManagerOptions) {
    entities.forEach((type) => {
      this.map.set(type, new Map());
    });
    this.inspect();
  }

  /**
   * Commit an entity to the store.
   * @param type
   * @param data
   * @returns
   */
  commit<
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryKeyField<Entity>,
  >(type: Type<Entity>, data: EntityData<Entity>) {
    const primaryKey = data[type.prototype[PRIMARY]] as Entity[Primary];
    const entity = this.retrieve(type, primaryKey);
    for (const k in entity[FIELDS]) {
      const field = k as keyof typeof data;
      this.commitField(entity, field, data[field]);
    }
    entity[POPULATED] = true;
    return entity;
  }

  /**
   * Get the reference to the target entity.
   *
   * Return the entity from the store if it exists, otherwise create an
   * unpopulated one in the store and return it.
   *
   * @param type
   * @param primaryKey
   * @returns
   */
  retrieve<
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryKeyField<Entity>,
  >(type: Type<Entity>, primaryKey: Entity[Primary]) {
    const store = this.getStore(type);
    let entity = store.get(primaryKey) as Entity;
    if (entity) {
      return entity;
    } else {
      entity = Object.create(type);
      entity[POPULATED] = false;
      Reflect.defineProperty(entity, entity[PRIMARY], {
        get: () => primaryKey,
      });
      return entity;
    }
  }

  private getStore<Entity extends BaseEntity<Entity>>(type: Type<Entity>) {
    const store = this.map.get(type);
    if (!store)
      throw new Error(
        `The entity ${type.name} must be registered to the entity manager`,
      );
    return store as EntityStore<Entity>;
  }

  private commitField<
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryKeyField<Entity>,
    Field extends EntityField<Entity>,
    Data extends EntityData<Entity>[Field],
  >(entity: Entity, field: Field, data: Data) {
    const { relation } = entity[FIELDS][field];
    let value: unknown;

    if (relation) {
      const { target: getTarget, multi } = relation;
      const target = getTarget();

      const handleRelation = <Entity extends BaseEntity>(
        foreignKeyOrData: PrimaryKey | EntityData<Entity>,
      ) => {
        if (typeof foreignKeyOrData == "object") {
          const data = foreignKeyOrData;
          return this.commit(target, data);
        } else {
          const fk = foreignKeyOrData;
          return this.retrieve(target, fk);
        }
      };

      if (multi) {
        const relationReferences = data as
          | PrimaryKey[]
          | EntityData<AnyEntity>[];
        value = relationReferences.map(handleRelation);
      } else {
        const relationReference = data as Primary | EntityData<AnyEntity>;
        value = handleRelation(relationReference);
      }
    } else {
      value = data;
    }

    Reflect.defineProperty(entity, field, { get: () => value });
  }

  /**
   * Check the registered entities.
   */
  private inspect() {
    for (const type of this.map.keys()) {
      const throwErr = (field: string | null, msg: string) => {
        throw new Error(`[${type.name}${field ? `:${field}` : ""}] ${msg}`);
      };

      if (!type.prototype[TYPE])
        throwErr(null, "Entities must be decorated by @Entity()");
      if (!type.prototype[FIELDS])
        throwErr(null, "Entities must have at least one field");
      if (!type.prototype[PRIMARY])
        throwErr(null, "Entities must have a primary key field");

      Object.values(type.prototype[FIELDS]).forEach(({ name, relation }) => {
        if (relation) {
          const { target } = relation;
          if (!this.map.has(target()))
            throwErr(name, "The relation entity is not registered");
        }
      });
    }
  }
}
