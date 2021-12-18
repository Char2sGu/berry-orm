import { AnyEntity } from "./entity/any-entity.type";
import { EntityType } from "./entity/entity-type.interface";
import { EntityField } from "./field/field-names/entity-field.type";
import { EntityManager } from "./managers/entity-manager.class";
import { RelationManager } from "./managers/relation-manager.class";
import { EntityMetaError } from "./meta/entity-meta.error";
import { META } from "./symbols";

export class BerryOrm {
  readonly registry: Set<EntityType>;
  readonly em: EntityManager;
  readonly rm: RelationManager;

  constructor(options: BerryOrmOptions) {
    this.registry = new Set(options.entities);
    this.inspect();
    this.em = new EntityManager(this);
    this.rm = new RelationManager(this);
  }

  private inspect() {
    const names = new Set<string>();

    this.registry.forEach((type) => {
      if (names.has(type.name)) throw new Error("Entity names must be unique");
      names.add(type.name);
      this.inspectEntity(type);
    });
  }

  private inspectEntity<Entity extends AnyEntity>(type: EntityType<Entity>) {
    const meta = type.prototype[META];

    if (!meta)
      throw new EntityMetaError({ type, message: "Must be decorated" });

    if (!meta.primary)
      throw new EntityMetaError({
        type,
        message: "Must have a primary field registered",
      });

    for (const field in meta.fields) {
      this.inspectEntityField(type, field as EntityField<Entity>);
    }
  }

  private inspectEntityField<Entity extends AnyEntity>(
    type: EntityType<Entity>,
    field: EntityField<Entity>,
  ) {
    const meta = type.prototype[META]!.fields[field];
    if (meta.relation) {
      if (!this.registry.has(meta.relation.target()))
        throw new EntityMetaError({
          type,
          field: meta.name,
          message: "The relation entity must be also registered",
        });

      const metaInverse =
        meta.relation.target().prototype[META]!.fields[meta.relation.inverse];

      if (!metaInverse.relation)
        throw new EntityMetaError({
          type,
          field,
          message: "The inverse side must be a relation field",
        });

      if (metaInverse.relation.target() != type)
        throw new EntityMetaError({
          type,
          field,
          message: "The inverse side must point back to this entity",
        });

      if (metaInverse.relation.inverse != field)
        throw new EntityMetaError({
          type,
          field,
          message:
            "The inverse side of the inverse side must point back to this field",
        });
    }
  }
}

interface BerryOrmOptions {
  entities: EntityType<AnyEntity>[];
}
