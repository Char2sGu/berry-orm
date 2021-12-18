import { AnyEntity } from "./entity/any-entity.type";
import { EntityType } from "./entity/entity-type.interface";
import { EntityManager } from "./managers/entity-manager.class";
import { RelationManager } from "./managers/relation-manager.class";
import { EntityMetaError } from "./meta/entity-meta.error";
import { META } from "./symbols";

export class BerryOrm {
  readonly registry: EntityRegistry;
  readonly em: EntityManager;
  readonly rm: RelationManager;

  constructor(options: BerryOrmOptions) {
    this.registry = this.inspect(new Set(options.entities));
    this.em = new EntityManager(this);
    this.rm = new RelationManager(this);
  }

  /**
   * Check whether the entity registry can work correctly.
   */
  private inspect<Registry extends EntityRegistry>(
    registry: Registry,
  ): Registry {
    const names = new Set<string>();

    registry.forEach((type) => {
      if (names.has(type.name)) throw new Error("Entity names must be unique");
      names.add(type.name);

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
}

type EntityRegistry = Set<EntityType>;

interface BerryOrmOptions {
  entities: EntityType<AnyEntity>[];
}
