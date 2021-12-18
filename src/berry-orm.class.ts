import { AnyEntity } from "./entity/any-entity.type";
import { EntityManager } from "./entity/entity-manager.class";
import { EntityRelationManager } from "./entity/entity-relation-manager.class";
import { EntityType } from "./entity/entity-type.interface";
import { IdentityMapManager } from "./entity/identity-map-manager.class";
import { EntityMetaError } from "./meta/entity-meta.error";
import { META } from "./symbols";

export class BerryOrm {
  static create(options: { entities: EntityType<AnyEntity>[] }): BerryOrm {
    const registry = this.inspect(new Set(options.entities));
    return new BerryOrm(registry);
  }

  /**
   * Check whether the entity registry can work correctly.
   */
  static inspect<Registry extends EntityRegistry>(
    registry: Registry,
  ): Registry {
    registry.forEach((type) => {
      if (!type.prototype[META])
        throw new EntityMetaError({ type, message: "Must be decorated" });
    });
    registry.forEach((type) => {
      type.prototype[META]!.inspect();
      Object.values(type.prototype[META]!.fields).forEach((meta) => {
        if (!meta.relation) return;
        if (!registry.has(meta.relation.target()))
          throw new EntityMetaError({
            type,
            field: meta.name,
            message: "The relation entity must be also registered",
          });
      });
    });
    return registry;
  }

  readonly erm: EntityRelationManager;
  readonly imm: IdentityMapManager;
  readonly em: EntityManager;

  private constructor(readonly registry: EntityRegistry) {
    this.erm = new EntityRelationManager(this);
    this.imm = new IdentityMapManager(this);
    this.em = new EntityManager(this);
  }

  fork(): BerryOrm {
    return new BerryOrm(this.registry);
  }
}

type EntityRegistry = Set<EntityType>;
