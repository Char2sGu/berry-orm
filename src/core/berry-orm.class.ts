import { AnyEntity } from "../entity/any-entity.type";
import { EntityType } from "../entity/entity-type.interface";
import { FieldDiscriminator } from "../field/field-discriminator.class";
import { EntityField } from "../field/field-names/entity-field.type";
import { EntityMetaError } from "../meta/entity-meta.error";
import { META } from "../symbols";
import { EntityEventManager } from "./entity-event-manager.class";
import { EntityManager } from "./entity-manager.class";
import { EntityRelationManager } from "./entity-relation-manager.class";
import { IdentityMap } from "./identity-map.class";

export class BerryOrm {
  private static nextVersion = 1;

  readonly parent?: BerryOrm;
  readonly registry: Set<EntityType>;
  readonly version = BerryOrm.nextVersion++;
  readonly em = new EntityManager(this);
  readonly erm = new EntityRelationManager(this);
  readonly eem = new EntityEventManager(this);
  readonly map = new IdentityMap(this);
  readonly discriminator = new FieldDiscriminator(this);

  constructor(options: BerryOrmOptions) {
    this.registry = new Set(options.entities);
    this.inspect();
  }

  fork(): BerryOrm {
    const orm: BerryOrm = Object.create(BerryOrm.prototype);
    orm.define("parent", this);
    orm.define("registry", this.registry);
    orm.define("version", BerryOrm.nextVersion++);
    orm.define("em", new EntityManager(orm));
    orm.define("erm", new EntityRelationManager(orm));
    orm.define("eem", new EntityEventManager(orm));
    orm.define("map", new IdentityMap(orm));
    return orm;
  }

  /**
   * Clear the identity map and update the ORM version, which will make all
   * existing entities belonging to this ORM instance to be unreachable.
   * @returns
   */
  reset(): this {
    this.map.clear();
    this.eem.off();
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

    if (!meta?.completed)
      throw new EntityMetaError({ type, message: "@Entity() must be applied" });

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
    }
  }

  /**
   * Bypass the `readonly` check.
   * @param key
   * @param value
   */
  private define<Key extends keyof this>(key: Key, value: this[Key]) {
    this[key] = value;
  }
}

interface BerryOrmOptions {
  entities: EntityType<AnyEntity>[];
}
