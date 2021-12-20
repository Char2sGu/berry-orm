import { AnyEntity } from "../entity/any-entity.type";
import { EntityType } from "../entity/entity-type.interface";
import { EntityField } from "../field/field-names/entity-field.type";
import { EntityMetaError } from "../meta/entity-meta.error";
import { META } from "../symbols";
import { EntityEventManager } from "./entity-event-manager.class";
import { EntityManager } from "./entity-manager.class";
import { EntityRelationManager } from "./entity-relation-manager.class";
import { IdentityMap } from "./identity-map.class";

export class BerryOrm {
  private static nextVersion = 1;

  readonly version = BerryOrm.nextVersion++;
  readonly parent?: BerryOrm;
  readonly registry: Set<EntityType>;
  readonly em: EntityManager;
  readonly erm: EntityRelationManager;
  readonly eem: EntityEventManager;
  readonly map: IdentityMap;

  constructor(options: BerryOrmOptions) {
    this.registry = new Set(options.entities);
    this.inspect();
    this.em = new EntityManager(this);
    this.erm = new EntityRelationManager(this);
    this.eem = new EntityEventManager(this);
    this.map = new IdentityMap(this);
  }

  fork(): BerryOrm {
    const orm: BerryOrm = Object.create(BerryOrm.prototype);
    orm.define("version", BerryOrm.nextVersion++);
    orm.define("parent", this);
    orm.define("registry", this.registry);
    orm.define("em", new EntityManager(this));
    orm.define("erm", new EntityRelationManager(this));
    orm.define("eem", new EntityEventManager(this));
    orm.define("map", new IdentityMap(this));
    return orm;
  }

  /**
   * Clear the identity map and update the ORM version, which will make all
   * existing entities belonging to this ORM instance to be unreachable.
   * @returns
   */
  reset(): this {
    this.map.clear();
    this.define("version", BerryOrm.nextVersion++);
    return this;
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
    const meta = type.prototype[META].fields[field];
    if (meta.relation) {
      if (!this.registry.has(meta.relation.target()))
        throw new EntityMetaError({
          type,
          field: meta.name,
          message: "The relation entity must be also registered",
        });

      const metaInverse =
        meta.relation.target().prototype[META].fields[meta.relation.inverse];

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

  private define<Key extends keyof this>(key: Key, value: this[Key]) {
    Object.defineProperty(this, key, { value });
  }
}

interface BerryOrmOptions {
  entities: EntityType<AnyEntity>[];
}
