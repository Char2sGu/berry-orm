import { BaseEntity } from "./base-entity.class";
import { EntityData } from "./entity-data.type";
import { EntityManagerOptions } from "./entity-manager-options.interface";
import { EntityStore } from "./entity-store.type";
import { PrimaryKeyField } from "./primary-key-field.type";
import { PrimaryKey } from "./primary-key.type";
import { FIELDS, POPULATED, PRIMARY } from "./symbols";
import { Type } from "./utils";

export class EntityManager {
  private map = new Map<Type<BaseEntity>, EntityStore<BaseEntity>>();

  constructor({ entities }: EntityManagerOptions) {
    entities.forEach((type) => {
      this.map.set(type, new Map() as EntityStore<BaseEntity>);
    });
  }

  /**
   * Commit an entity to the store.
   * @param type
   * @param data
   * @returns
   */
  commit<T extends BaseEntity<T, Primary>, Primary extends PrimaryKeyField<T>>(
    type: Type<T>,
    data: EntityData<T>,
  ) {
    const primaryKey = data[type.prototype[PRIMARY]] as T[Primary];
    const entity = this.retrieve(type, primaryKey);

    for (const [k, { relation }] of Object.entries(entity[FIELDS])) {
      const name = k as keyof typeof data;
      const origin = data[name];

      // already defined in `.retrieve()`
      if (name == entity[PRIMARY]) continue;

      let fieldValue: unknown;
      if (relation) {
        const target = relation.target();

        const handleRelation = <T extends BaseEntity>(
          foreignKeyOrData: PrimaryKey | EntityData<T>,
        ) => {
          if (typeof foreignKeyOrData == "object") {
            const data = foreignKeyOrData;
            return this.commit<any, any>(target, data);
          } else {
            const fk = foreignKeyOrData;
            return this.retrieve<any, any>(target, fk);
          }
        };

        if (relation.multi) {
          const relationReferences = origin as
            | PrimaryKey[]
            | EntityData<BaseEntity>[];
          fieldValue = relationReferences.map(handleRelation);
        } else {
          const relationReference = origin as Primary | EntityData<BaseEntity>;
          fieldValue = handleRelation(relationReference);
        }
      } else {
        fieldValue = origin;
      }

      Reflect.defineProperty(entity, name, { get: () => fieldValue });
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
    T extends BaseEntity<T, Primary>,
    Primary extends PrimaryKeyField<T>,
  >(type: Type<T>, primaryKey: T[Primary]) {
    const store = this.getStore(type);
    let entity = store.get(primaryKey) as T;
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

  private getStore<T extends BaseEntity<T>>(type: Type<T>) {
    const store = this.map.get(type);
    if (!store)
      throw new Error(
        `The entity ${type.name} must be registered to the entity manager`,
      );
    return store as EntityStore<T>;
  }
}
