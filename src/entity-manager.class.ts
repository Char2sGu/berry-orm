import { AnyEntity } from "./any-entity.type";
import { BaseEntity } from "./base-entity.class";
import { EntityData } from "./entity-data.type";
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

    if (!entity[POPULATED]) {
      for (const k in entity[FIELDS]) {
        const field = k as keyof typeof data;
        const relationMeta = entity[FIELDS][field].relation!;
        if (!relationMeta) {
          this.defineFieldValue(entity, field, data[field]);
        } else if (relationMeta.multi) {
          const relationEntities: AnyEntity[] = [];
          this.defineFieldValue(entity, field, relationEntities);
          const foreignKeysOrDataList = data[field] as
            | PrimaryKey[]
            | EntityData<AnyEntity>[];
          foreignKeysOrDataList.forEach((foreignKeyOrData) => {
            const relationEntity = this.resolveRelationData(
              entity,
              field,
              foreignKeyOrData,
            );
            relationEntities.push(relationEntity);
          });
        } else {
          const foreignKeyOrData = data as PrimaryKey | EntityData<AnyEntity>;
          const relationEntity = this.resolveRelationData(
            entity,
            field,
            foreignKeyOrData,
          );
          this.defineFieldValue(entity, field, relationEntity);
        }
      }
      entity[POPULATED] = true;
    }

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
    let entity = store.get(primaryKey) as Entity | undefined;
    if (entity) {
      return entity;
    } else {
      const entity = Object.create(type.prototype);
      entity[POPULATED] = false;
      this.defineFieldValue(entity, entity[PRIMARY], primaryKey);
      store.set(primaryKey, entity);
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
          if (!this.map.has(relation.target()))
            throwErr(name, "The relation entity is not registered");
        }
      });
    }
  }

  private defineFieldValue(entity: AnyEntity, field: string, value: unknown) {
    Reflect.defineProperty(entity, field, { get: () => value });
  }

  /**
   * Get the reference of the target relation entity from relation data.
   * @param entity
   * @param field
   * @param data
   * @returns
   */
  private resolveRelationData(
    entity: AnyEntity,
    field: string,
    data:
      | PrimaryKey
      | PrimaryKey[]
      | EntityData<AnyEntity>
      | EntityData<AnyEntity>[],
  ) {
    const relationMeta = entity[FIELDS][field].relation!;
    if (typeof data == "object") {
      return this.commit(relationMeta.target(), data);
    } else {
      return this.retrieve(relationMeta.target(), data);
    }
  }
}
