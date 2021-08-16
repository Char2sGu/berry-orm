import { AnyEntity } from ".";
import { BaseEntity } from "./base-entity.class";
import { Collection } from "./collection.class";
import { EmptyValue } from "./empty-value.type";
import { EntityData } from "./entity-data.type";
import { EntityManagerOptions } from "./entity-manager-options.interface";
import { EntityStore } from "./entity-store.type";
import { PrimaryKeyField } from "./primary-key-field.type";
import { RelationEntityRepresentation } from "./relation-entity-representation.type";
import { RelationFieldData } from "./relation-field-data.type";
import { RelationField } from "./relation-field.type";
import { DATA, META, POPULATED } from "./symbols";
import { Type } from "./utils/type.type";

export class EntityManager {
  private map = new Map<Type<AnyEntity>, EntityStore<AnyEntity>>();

  constructor({ entities }: EntityManagerOptions) {
    entities.forEach((type) => this.map.set(type, new Map()));
    this.inspect();
  }

  /**
   * Populate the entity using the data.
   * @param type
   * @param data
   * @returns
   */
  populate<
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryKeyField<Entity>,
  >(type: Type<Entity>, data: EntityData<Entity>) {
    const primaryKey = data[
      type.prototype[META].fields.primary
    ] as Entity[Primary];
    const entity = this.retrieve(type, primaryKey);

    for (const k in entity[META].fields.items) {
      const field = k as keyof typeof data;
      const fieldData = data[field];

      if (!(field in data)) continue;
      if (field == entity[META].fields.primary) continue;

      const relationMeta = entity[META].fields.items[field].relation;
      if (!relationMeta) {
        entity[field as keyof Entity] =
          fieldData as unknown as Entity[keyof Entity];
      } else {
        this.populateRelationField(
          entity,
          field as RelationField<Entity>,
          fieldData as RelationFieldData<Entity>,
        );
      }
    }
    entity[POPULATED] = true;

    return entity;
  }

  /**
   * Populate the specified relation field of the entity using the data.
   * @param entity
   * @param field
   * @param data
   * @returns
   */
  populateRelationField<
    Entity extends BaseEntity,
    Field extends RelationField<Entity>,
  >(entity: Entity, field: Field, data: RelationFieldData<Entity, Field>) {
    this.clearRelations(entity, field);

    if (!data) return;

    const relationMeta = entity[META].fields.items[field].relation!;
    const representations = (
      relationMeta.multi ? data : [data]
    ) as RelationEntityRepresentation[];
    representations.forEach((data) => {
      const targetEntity = this.resolveRelationEntityRepresentation(
        entity,
        field,
        data,
      );
      this.constructRelation(entity, field, targetEntity);
    });
  }

  /**
   * Get the reference to the target entity.
   *
   * Return the entity from the store if it exists, otherwise create an
   * unpopulated one in the store and return it.
   *
   * @param type
   * @param primaryKey
   * @returns
   */
  retrieve<
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryKeyField<Entity>,
  >(type: Type<Entity>, primaryKey: Entity[Primary]) {
    const store = this.getStore(type);
    let entity = store.get(primaryKey) as Entity | undefined;
    if (!entity) {
      entity = this.createEntity(type, primaryKey);
      store.set(primaryKey, entity);
    }
    return entity;
  }

  /**
   * Get the target relation entity from a primary key or a data object.
   * @param entity
   * @param field
   * @param reference
   * @returns
   */
  resolveRelationEntityRepresentation<Entity extends BaseEntity>(
    entity: Entity,
    field: RelationField<Entity>,
    reference: RelationEntityRepresentation,
  ) {
    const relationMeta = entity[META].fields.items[field].relation!;
    if (typeof reference == "object") {
      // TODO: Support this
      // specifying inverse relations in nested data is not supported
      delete reference[relationMeta.inverse];
      return this.populate(relationMeta.target(), reference);
    } else {
      return this.retrieve(relationMeta.target(), reference);
    }
  }

  /**
   * Destruct any bilateral relation on the specified field of the entity.
   * @param entity
   * @param field
   */
  clearRelations<Entity extends BaseEntity>(
    entity: Entity,
    field: RelationField<Entity>,
  ) {
    this.invokeOnRelationField(
      entity,
      field,
      (relationEntity) => {
        if (!relationEntity) return;
        this.destructRelation(entity, field, relationEntity);
        return undefined;
      },
      (relationEntities) => {
        relationEntities.forEach((relationEntity) =>
          this.destructRelation(entity, field, relationEntity),
        );
        return relationEntities;
      },
    );
  }

  /**
   * Construct a bilateral relation with the target entity on the specified
   * field of the entity.
   * @param entity
   * @param field
   * @param targetEntity
   */
  constructRelation<Entity extends BaseEntity>(
    entity: Entity,
    field: RelationField<Entity>,
    targetEntity: AnyEntity,
  ) {
    this.invokeOnRelationFieldBilateral(
      entity,
      field,
      targetEntity,
      (targetEntity) => targetEntity,
      (targetEntity, entities) => entities.add(targetEntity),
    );
  }

  /**
   * Destruct the bilateral relation with the target entity on the specified
   * field of the entity if exists.
   * @param entity
   * @param field
   * @param targetEntity
   */
  destructRelation<Entity extends BaseEntity>(
    entity: Entity,
    field: RelationField<Entity>,
    targetEntity: AnyEntity,
  ) {
    this.invokeOnRelationFieldBilateral(
      entity,
      field,
      targetEntity,
      (targetEntity, entity) => (entity == targetEntity ? undefined : entity),
      (targetEntity, entities) => {
        entities?.delete(targetEntity);
        return entities;
      },
    );
  }

  /**
   * Get the store of the target entity or throw an error if the entity is not
   * registered.
   * @param type
   * @returns
   */
  private getStore<Entity extends BaseEntity>(type: Type<Entity>) {
    const store = this.map.get(type);
    if (!store)
      throw new Error(
        `The entity ${type.name} must be registered to the entity manager`,
      );
    return store as EntityStore<Entity>;
  }

  /**
   * Instantiate an entity and initialize its fields.
   * @param type
   */
  private createEntity<
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryKeyField<Entity>,
  >(type: Type<Entity>, primaryKey: Entity[Primary]) {
    const entity = new type();
    entity[POPULATED] = false;
    entity[DATA] = {};
    Object.keys(entity[META].fields.items).forEach((field) =>
      this.initField(entity, field),
    );
    entity[DATA][entity[META].fields.primary] = primaryKey;
    return entity;
  }

  /**
   * Define accessors on the specified field of the entity to prevent
   * unexpected bugs and instantiate {@link Collection}s.
   * @param entity
   * @param field
   */
  private initField(entity: AnyEntity, field: string) {
    const isPrimaryKeyField = entity[META].fields.primary == field;
    const isCollectionField =
      !!entity[META].fields.items[field].relation?.multi;

    if (isCollectionField) entity[DATA][field] = new Collection(this, entity);

    Reflect.defineProperty(entity, field, {
      get: () => entity[DATA][field],
      set: isPrimaryKeyField
        ? () => {
            throw new Error("The Primary key cannot be updated");
          }
        : isCollectionField
        ? () => {
            throw new Error("Collection fields cannot be set");
          }
        : (value: unknown) => {
            entity[DATA][field] = value;
          },
    });
  }

  /**
   * A wrap of {@link EntityManager.invokeOnRelationField} which makes it
   * easier to operate on the both sides of the relation.
   * @param entity
   * @param field
   * @param targetEntity
   * @param onToOne
   * @param onToMany
   */
  private invokeOnRelationFieldBilateral(
    entity: AnyEntity,
    field: string,
    targetEntity: AnyEntity,
    onToOne?: (
      targetEntity: AnyEntity,
      entity: AnyEntity | EmptyValue,
    ) => AnyEntity | EmptyValue,
    onToMany?: (
      targetEntity: AnyEntity,
      entities: Collection<AnyEntity>,
    ) => Collection<AnyEntity>,
  ) {
    const wrappedInvoke = (
      entity: AnyEntity,
      field: string,
      targetEntity: AnyEntity,
    ) =>
      this.invokeOnRelationField(
        entity,
        field,
        onToOne ? (entity) => onToOne(targetEntity, entity) : undefined,
        onToMany ? (entities) => onToMany(targetEntity, entities) : undefined,
      );

    const relationMeta = entity[META].fields.items[field].relation!;
    wrappedInvoke(entity, field, targetEntity);
    wrappedInvoke(targetEntity, relationMeta.inverse, entity);
  }

  /**
   * Invoke a callback based on the field's relation type.
   * @param entity
   * @param field
   * @param onToOne - The callback to be invoked on a to-one relation field.
   * The return value will be the value of the field.
   * @param onToMany - The callback to be invoked on a to-many relation field.
   */
  private invokeOnRelationField(
    entity: AnyEntity,
    field: string,
    onToOne?: (entity: AnyEntity | EmptyValue) => AnyEntity | EmptyValue,
    onToMany?: (entities: Collection<AnyEntity>) => void,
  ) {
    const relationMeta = entity[META].fields.items[field].relation;
    if (relationMeta?.multi) {
      if (!onToMany) return;
      const relationEntities = entity[field] as Collection<AnyEntity>;
      onToMany(relationEntities);
    } else {
      if (!onToOne) return;
      const relationEntity = entity[field] as AnyEntity | EmptyValue;
      const processed = onToOne(relationEntity);
      entity[DATA][field] = processed;
    }
  }

  /**
   * Inspect the registered entities.
   */
  private inspect() {
    const buildErrorBuilder =
      (type: Type) => (field: string | null, msg: string) => {
        return new Error(`[${type.name}${field ? `:${field}` : ""}] ${msg}`);
      };

    // individual inspection of each entity
    for (const type of this.map.keys()) {
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
          if (!this.map.has(relation.target()))
            throw buildError(name, "The relation entity is not registered");
        }
      });
    }

    // overall inspection
    for (const type of this.map.keys()) {
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
