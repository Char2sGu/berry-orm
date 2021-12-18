import { AnyEntity } from "./entity/any-entity.type";
import { EntityType } from "./entity/entity-type.interface";
import { EntityManager } from "./managers/entity-manager.class";
import { IdentityMapManager } from "./managers/identity-map-manager.class";
import { RelationManager } from "./managers/relation-manager.class";
import { EntityMetaError } from "./meta/entity-meta.error";
import { META } from "./symbols";

export class BerryOrm {
  static create(options: BerryOrmOptions): BerryOrm {
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

  readonly em: EntityManager;
  readonly rm: RelationManager;
  readonly imm: IdentityMapManager;

  private constructor(readonly registry: EntityRegistry) {
    this.em = new EntityManager(this);
    this.rm = new RelationManager(this);
    this.imm = new IdentityMapManager(this);
  }

  fork(): BerryOrm {
    return new BerryOrm(this.registry);
  }
}

type EntityRegistry = Set<EntityType>;

interface BerryOrmOptions {
  entities: EntityType<AnyEntity>[];
}
