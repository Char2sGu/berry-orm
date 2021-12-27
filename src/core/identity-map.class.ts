import { AnyEntity } from "../entity/any-entity.type";
import { EntityType } from "../entity/entity-type.interface";
import { PrimaryKey } from "../field/field-values/primary-key.type";
import { BerryOrm } from "./berry-orm.class";

export class IdentityMap {
  private map = new Map<string, AnyEntity>();

  constructor(readonly orm: BerryOrm) {}

  get<Entity extends AnyEntity>(
    type: EntityType<Entity>,
    primaryKey: PrimaryKey<Entity>,
  ): Entity {
    this.checkType(type);
    const id = this.identify(type, primaryKey);
    let entity = this.map.get(id) as Entity | undefined;
    if (!entity) {
      entity = new type(this.orm, primaryKey);
      this.set(type, primaryKey, entity);
    }
    return entity as Entity;
  }

  set<Entity extends AnyEntity>(
    type: EntityType<Entity>,
    primaryKey: PrimaryKey<Entity>,
    entity: Entity,
  ): this {
    this.checkType(type);
    const id = this.identify(type, primaryKey);
    this.map.set(id, entity);
    return this;
  }

  has<Entity extends AnyEntity>(
    type: EntityType<Entity>,
    primaryKey: PrimaryKey<Entity>,
  ): boolean {
    this.checkType(type);
    const id = this.identify(type, primaryKey);
    return this.map.has(id);
  }

  /**
   * Clear the identities.
   *
   * In most cases, you are NOT likely to invoke this method manually because
   * this won't deal with the existing entities. Maybe {@link BerryOrm.reset}
   * is what you want.
   */
  clear(): void {
    this.map.clear();
  }

  *[Symbol.iterator](): Iterator<[string, AnyEntity]> {
    yield* this.map[Symbol.iterator]();
  }

  private identify<Entity extends AnyEntity>(
    type: EntityType<Entity>,
    key: PrimaryKey<Entity>,
  ) {
    return `${type.name}:${key}` as const;
  }

  private checkType<Entity extends AnyEntity>(type: EntityType<Entity>) {
    if (!this.orm.registry.has(type as EntityType))
      throw new Error(`${type.name} is not a known entity type`);
  }
}
