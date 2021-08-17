import { AnyEntity } from "..";
import { META } from "../symbols";
import { BaseEntity } from "./base-entity.class";
import { EntityStore } from "./entity-store.class";
import { EntityType } from "./entity-type.type";

export class EntityStoreManager {
  private map;
  private registry;

  constructor(entities: EntityType<AnyEntity>[]) {
    this.map = new Map<EntityType<AnyEntity>, EntityStore<AnyEntity>>();
    this.registry = new Set<EntityType<AnyEntity>>(entities);
    this.inspect();
  }

  get(type: EntityType<AnyEntity>) {
    this.checkType(type);
    return this.map.get(type) ?? this.createStore(type);
  }

  private createStore<Entity extends BaseEntity>(type: EntityType<Entity>) {
    const store = new EntityStore<Entity>();
    this.map.set(type, store);
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
