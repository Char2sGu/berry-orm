import { AnyEntity } from ".";
import { EntityManager } from "./entity-manager.class";
import { EntityType } from "./entity/entity-type.type";
import { IdentityMapManager } from "./identity-map-manager.class";
import { META } from "./symbols";

export class BerryOrm {
  readonly imm;
  readonly em;

  constructor(options: { entities: EntityType<AnyEntity>[] }) {
    const registry = this.inspect(new Set(options.entities));
    this.imm = new IdentityMapManager(registry);
    this.em = new EntityManager(this.imm);
  }

  /**
   * Check whether the entity type set can work correctly.
   */
  private inspect(registry: Set<EntityType>) {
    const buildErrorBuilder =
      (type: EntityType) => (field: string | null, msg: string) => {
        return new Error(`[${type.name}${field ? `:${field}` : ""}] ${msg}`);
      };

    // individual inspection of each entity
    for (const type of registry) {
      const buildError = buildErrorBuilder(type);

      const meta = type.prototype[META];

      if (!meta) throw buildError(null, "Entity must be decorated");
      if (!meta.type)
        throw buildError(null, "Entity must be decorated by @Entity()");
      if (!meta.fields)
        throw buildError(null, "Entity must have at least one field");
      if (!meta.fields.primary)
        throw buildError(null, "Entity must have a primary key field");

      Object.values(meta.fields.items).forEach(({ name, relation }) => {
        if (relation) {
          if (!registry.has(relation.target()))
            throw buildError(name, "The relation entity is not registered");
        }
      });
    }

    // overall inspection
    for (const type of registry) {
      const throwErr = buildErrorBuilder(type);
      Object.values(type.prototype[META].fields.items).forEach(
        ({ name, relation }) => {
          if (relation) {
            const { target, inverse } = relation;
            const inverseMeta = target().prototype[META].fields.items[inverse];
            if (!inverseMeta.relation)
              throwErr(name, "The inverse side must be a relation field");
            if (inverseMeta.relation?.target() != type)
              throwErr(name, "The inverse side must point back to this entity");
            if (inverseMeta.relation?.inverse != name)
              throwErr(
                name,
                "The inverse side of the inverse side must point back to this field",
              );
          }
        },
      );
    }

    return registry;
  }
}
