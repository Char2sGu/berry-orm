import { BerryOrm } from "../berry-orm.class";
import { AnyEntity } from "../entity/any-entity.type";
import { EntityType } from "../entity/entity-type.interface";
import { IdentityMap } from "./identity-map.class";

export class IdentityMapManager {
  private readonly identityMaps = new Map<
    EntityType<AnyEntity>,
    IdentityMap<AnyEntity>
  >();

  constructor(private orm: BerryOrm) {}

  get<Entity extends AnyEntity>(type: EntityType<Entity>): IdentityMap<Entity> {
    this.checkType(type);
    return (
      (this.identityMaps.get(type) as IdentityMap<Entity>) ??
      this.createIdentityMap(type)
    );
  }

  clear(): void {
    this.identityMaps.forEach((map) => map.clear());
  }

  private createIdentityMap<Entity extends AnyEntity>(
    type: EntityType<Entity>,
  ) {
    const map = new IdentityMap(this.orm, type);
    this.identityMaps.set(type, map);
    return map;
  }

  private checkType(type: EntityType) {
    if (!this.orm.registry.has(type))
      throw new Error(`${type.name} is not a known entity type`);
  }
}
