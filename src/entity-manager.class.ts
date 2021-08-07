import { BaseEntity } from "./base-entity.class";
import { EntityData } from "./entity-data.type";
import { META, PK } from "./symbols";
import { Type } from "./utils";

export class EntityManager {
  private map = new Map<Type<BaseEntity>, Map<string, BaseEntity>>();

  constructor(entities: Type<BaseEntity>[]) {
    this.register(entities);
  }

  register(entities: Type<BaseEntity>[]) {
    entities.forEach((type) => {
      if (this.map.has(type)) return;
      this.map.set(type, new Map());
    });
    return this;
  }

  clear() {
    for (const map of this.map.values()) map.clear();
    return this;
  }

  insert<T extends BaseEntity>(type: Type<T>, data: EntityData<T>) {
    const store = this.getStore(type);
    const entity = this.transform(type, data);
    store.set(entity[PK], entity);
    return this;
  }

  transform<T extends BaseEntity>(type: Type<T>, data: EntityData<T>) {
    const entity: T = Object.create(type.prototype);
    const meta = entity[META];
    for (const k in meta.fields.items) {
      const name = k as keyof typeof data;
      entity[name] = data[name];
    }
    return entity;
  }

  private getStore(type: Type<BaseEntity>) {
    const store = this.map.get(type);
    if (!store)
      throw new Error(
        `The entity ${type.name} must be registered to the entity manager`,
      );
    return store;
  }
}
