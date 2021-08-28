import { AnyEntity } from "..";
import { EntityRelationManager } from "./entity-relation-manager.class";
import { EntityType } from "./entity-type.type";
import { IdentityMap } from "./identity-map.class";

export class IdentityMapManager {
  private readonly identityMaps = new Map<
    EntityType<AnyEntity>,
    IdentityMap<AnyEntity>
  >();

  constructor(
    private readonly registry: Set<EntityType>,
    private readonly relationManager: EntityRelationManager,
  ) {}

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
    const map = new IdentityMap(type, this.relationManager);
    this.identityMaps.set(type, map);
    return map;
  }

  private checkType(type: EntityType) {
    if (!this.registry.has(type))
      throw new Error(`${type.name} is not a known entity type`);
  }
}
