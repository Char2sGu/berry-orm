import { AnyEntity } from "..";
import { META } from "../symbols";
import { BaseEntity } from "./base-entity.class";
import { EntityType } from "./entity-type.type";
import { IdentityMap } from "./identity-map.class";

export class IdentityMapManager {
  private identityMaps = new Map<
    EntityType<AnyEntity>,
    IdentityMap<AnyEntity>
  >();

  constructor(private registry: Set<EntityType>) {}

  get<Entity extends BaseEntity>(
    type: EntityType<Entity>,
  ): IdentityMap<Entity> {
    this.checkType(type);
    return this.identityMaps.get(type) ?? this.createIdentityMap(type);
  }

  clear(): void {
    this.identityMaps.forEach((map) => map.clear());
  }

  private createIdentityMap<Entity extends BaseEntity>(
    type: EntityType<Entity>,
  ) {
    const map = type.prototype[META].map();
    this.identityMaps.set(type, map);
    return map;
  }

  private checkType(type: EntityType<AnyEntity>) {
    if (!this.registry.has(type))
      throw new Error(`${type.name} is not a known entity type`);
  }
}
