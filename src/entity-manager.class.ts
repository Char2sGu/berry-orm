import { BaseEntity } from "./base-entity.class";
import { EntityData } from "./entity-data.type";
import { META } from "./symbols";
import { Type } from "./utils/type.type";

export class EntityManager {
  private map = new Map<Type<BaseEntity>, Map<string, BaseEntity>>();

  constructor(entities: Type<BaseEntity>[]) {
    this.register(entities);
  }

  register(entities: Type<BaseEntity>[]) {
    entities.forEach((type) => {
      if (this.map.has(type)) return;
      if (!type.prototype[META] || !type.prototype[META].inspected)
        throw new Error(
          `The entity ${type.name} must be decorated using "@Entity"`,
        );
      this.map.set(type, new Map());
    });
    return this;
  }

  clear() {
    for (const map of this.map.values()) map.clear();
    return this;
  }

  insert<T extends BaseEntity>(type: Type<T>, data: EntityData<T>) {
    const entity = this.transform(type, data);
    const store = this.map.get(type);
    if (!store)
      throw new Error(
        `The entity ${type.name} must be registered to the entity manager`,
      );
    store.set(entity._pk, entity);
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
}
