import { AnyEntity } from ".";
import { EntityManager } from "./entity/entity-manager.class";
import { EntityRelationManager } from "./entity/entity-relation-manager.class";
import { EntityType } from "./entity/entity-type.type";
import { IdentityMapManager } from "./entity/identity-map-manager.class";
import { EntityMetaError } from "./meta/entity-meta.error";
import { META } from "./symbols";

export class BerryOrm {
  readonly erm;
  readonly imm;
  readonly em;

  constructor(options: { entities: EntityType<AnyEntity>[] }) {
    const registry = this.inspect(new Set(options.entities));
    this.erm = new EntityRelationManager();
    this.imm = new IdentityMapManager(registry, this.erm);
    this.em = new EntityManager(this.imm, this.erm);
  }

  /**
   * Check whether the entity registry can work correctly.
   */
  private inspect(registry: Set<EntityType>) {
    registry.forEach((type) => {
      if (!type.prototype[META])
        throw new EntityMetaError({ type, message: "Must be decorated" });
    });
    registry.forEach((type) => {
      type.prototype[META].inspect();
      Object.values(type.prototype[META].fields).forEach((meta) => {
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
}
