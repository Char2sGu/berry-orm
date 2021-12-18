import { BerryOrm } from "../berry-orm.class";
import { AnyEntity } from "../entity/any-entity.type";
import { EntityType } from "../entity/entity-type.interface";
import { EntityPrimaryKey } from "../field/entity-primary-key.type";

export class IdentityMap {
  private map = new Map<string, AnyEntity>();

  constructor(private orm: BerryOrm) {}

  get<Entity extends AnyEntity>(
    type: EntityType<Entity>,
    primaryKey: EntityPrimaryKey<Entity>,
  ): Entity {
    this.checkType(type);
    const id = this.identify(type, primaryKey);
    let entity = this.map.get(id);
    if (!entity) {
      entity = new type(this.orm, primaryKey);
      this.set(type, primaryKey, entity);
    }
    return entity as Entity;
  }

  set<Entity extends AnyEntity>(
    type: EntityType<Entity>,
    primaryKey: EntityPrimaryKey<Entity>,
    entity: Entity,
  ): this {
    this.checkType(type);
    const id = this.identify(type, primaryKey);
    this.map.set(id, entity);
    return this;
  }

  forEach = this.map.forEach.bind(this.map);
  clear = this.map.clear.bind(this.map);
  [Symbol.iterator] = this.map[Symbol.iterator].bind(this.map);

  private identify<Entity extends AnyEntity>(
    type: EntityType<Entity>,
    key: EntityPrimaryKey<Entity>,
  ) {
    return `${type.name}:${key}` as const;
  }

  private checkType(type: EntityType) {
    if (!this.orm.registry.has(type))
      throw new Error(`${type.name} is not a known entity type`);
  }
}
