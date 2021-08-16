import { AnyEntity } from ".";
import { BaseEntity } from "./base-entity.class";
import { EntityStore } from "./entity-store.class";
import { EntityType } from "./entity-type.type";
import { META } from "./symbols";

export class EntityStoreMap extends Map<
  EntityType<AnyEntity>,
  EntityStore<AnyEntity>
> {
  registry: Set<EntityType<AnyEntity>>;

  constructor(entities: EntityType<AnyEntity>[]) {
    super();
    this.registry = new Set(entities);
    this.inspect();
  }

  get(type: EntityType<AnyEntity>) {
    this.checkType(type);
    return super.get(type) ?? this.createStore(type);
  }

  set<Entity extends BaseEntity>(
    type: EntityType<Entity>,
    store: EntityStore<Entity>,
  ) {
    this.checkType(type);
    return super.set(type, store);
  }

  private createStore<Entity extends BaseEntity>(type: EntityType<Entity>) {
    const store = new EntityStore<Entity>();
    this.set(type, store);
    return store;
  }

  private checkType(type: EntityType<AnyEntity>) {
    if (!this.registry.has(type))
      throw new Error(`${type.name} is not a known entity type`);
  }

  /**
   * Inspect the registered entities.
   */
  private inspect() {
    const buildErrorBuilder =
      (type: EntityType) => (field: string | null, msg: string) => {
        return new Error(`[${type.name}${field ? `:${field}` : ""}] ${msg}`);
      };

    // individual inspection of each entity
    for (const type of this.registry) {
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
          if (!this.registry.has(relation.target()))
            throw buildError(name, "The relation entity is not registered");
        }
      });
    }

    // overall inspection
    for (const type of this.registry) {
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
  }
}
