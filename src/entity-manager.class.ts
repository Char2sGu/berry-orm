import { BaseEntity } from "./base-entity.class";
import { EntityData } from "./entity-data.type";
import { EntityManagerOptions } from "./entity-manager-options.interface";
import { EntityStore } from "./entity-store.type";
import { PrimaryKeyField } from "./primary-key-field.type";
import { FIELDS, PRIMARY } from "./symbols";
import { Type } from "./utils";

export class EntityManager {
  private map = new Map<
    Type<BaseEntity<any, any>>,
    EntityStore<BaseEntity<any, any>>
  >();

  constructor({ entities }: EntityManagerOptions) {
    entities.forEach((type) => {
      this.map.set(type, new Map() as EntityStore<BaseEntity<any, any>>);
    });
  }

  commit<T extends BaseEntity<T, any>>(type: Type<T>, data: EntityData<T> | T) {
    const store = this.getStore(type);
    const entity = isEntityData(data) ? this.transform(type, data) : data;
    store.set(entity[PRIMARY], entity);
    return entity;

    function isEntityData(v: typeof data): v is EntityData<T> {
      return v instanceof type;
    }
  }

  retrieve<
    T extends BaseEntity<T, Primary>,
    Primary extends PrimaryKeyField<T>,
  >(type: Type<T>, primaryKey: T[Primary]) {
    const store = this.getStore(type);
    let entity = store.get(primaryKey) as T | undefined;
    if (entity) return entity;
    else return null;
  }

  transform<T extends BaseEntity<T, any>>(type: Type<T>, data: EntityData<T>) {
    const entity: T = Object.create(type.prototype);
    for (const k in entity[FIELDS]) {
      const name = k as keyof typeof data;
      const value = data[name];
      const { relation } = entity[FIELDS][name];
      Reflect.defineProperty(entity, name, {
        get: relation
          ? value instanceof Array
            ? () => value.map((fk) => this.retrieve<any, any>(relation(), fk))
            : () => this.retrieve<any, any>(relation(), value)
          : () => value,
      });
    }
    return entity;
  }

  private getStore<T extends BaseEntity<T, any>>(type: Type<T>) {
    const store = this.map.get(type);
    if (!store)
      throw new Error(
        `The entity ${type.name} must be registered to the entity manager`,
      );
    return store as EntityStore<T>;
  }
}
