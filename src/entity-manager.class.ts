import { BaseEntity } from "./base-entity.class";
import { EntityData } from "./entity-data.type";
import { EntityManagerOptions } from "./entity-manager-options.interface";
import { EntityStore } from "./entity-store.type";
import { FIELDS, PRIMARY } from "./symbols";
import { Type } from "./utils";

export class EntityManager {
  private map = new Map<
    Type<BaseEntity<any, any>>,
    EntityStore<BaseEntity<any, any>>
  >();

  constructor({ entities }: EntityManagerOptions) {
    entities.forEach((type) => {
      this.map.set(type, new Map());
    });
  }

  clear() {
    for (const map of this.map.values()) map.clear();
    return this;
  }

  insert<T extends BaseEntity<T, any>>(type: Type<T>, data: EntityData<T>) {
    const store = this.getStore(type);
    const entity = this.transform(type, data);
    store.set(entity[PRIMARY], entity);
    return this;
  }

  transform<T extends BaseEntity<T, any>>(type: Type<T>, data: EntityData<T>) {
    const entity: T = Object.create(type.prototype);
    for (const k in entity[FIELDS]) {
      const name = k as keyof typeof data;
      entity[name] = data[name];
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
