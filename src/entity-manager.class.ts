import {
  AnyEntity,
  BaseEntity,
  Collection,
  EmptyValue,
  EntityData,
  EntityManagerOptions,
  EntityStore,
  FIELDS,
  POPULATED,
  PRIMARY,
  PrimaryKeyField,
  RelationEntityRepresentation,
  RelationField,
  RelationFieldData,
  Type,
  TYPE,
} from ".";

export class EntityManager {
  private map = new Map<Type<AnyEntity>, EntityStore<AnyEntity>>();

  constructor({ entities }: EntityManagerOptions) {
    entities.forEach((type) => this.map.set(type, new Map()));
    this.inspect();
  }

  /**
   * Create or update an entity in the store.
   * @param type
   * @param data
   * @returns
   */
  commit<
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryKeyField<Entity>,
  >(type: Type<Entity>, data: EntityData<Entity>) {
    const primaryKey = data[type.prototype[PRIMARY]] as Entity[Primary];
    const entity = this.retrieve(type, primaryKey);

    for (const k in entity[FIELDS]) {
      const field = k as keyof typeof data;
      const fieldData = data[field];

      if (!(field in data)) continue;
      if (field == entity[PRIMARY]) continue;

      const relationMeta = entity[FIELDS][field].relation;
      if (!relationMeta) {
        entity[field as keyof Entity] =
          fieldData as unknown as Entity[keyof Entity];
      } else {
        this.updateRelationField(
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

  // --------------------------------------------------------------------------
  // Common

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
    Object.keys(entity[FIELDS]).forEach((field) =>
      this.initField(entity, field),
    );
    entity[POPULATED] = false;
    entity[entity[PRIMARY]] = primaryKey;
    return entity;
  }

  /**
   * Define accessors on the specified field of the entity to prevent
   * unexpected bugs and instantiate {@link Collection}s.
   * @param entity
   * @param field
   */
  private initField(entity: AnyEntity, field: string) {
    const isPrimaryKeyField = entity[PRIMARY] == field;
    const isCollectionField = !!entity[FIELDS][field].relation?.multi;

    let fieldValue: unknown;
    Reflect.defineProperty(entity, field, {
      get: () => fieldValue,
      set: (value: unknown) => {
        if (isPrimaryKeyField && fieldValue)
          throw new Error("The Primary key cannot be updated");
        if (isCollectionField && fieldValue)
          throw new Error("Collection fields cannot be set");
        fieldValue = value;
      },
    });

    if (isCollectionField) entity[field] = new Collection(this, entity);
  }

  // --------------------------------------------------------------------------
  // Relation

  /**
   * Update the bilateral relation on the specified field of the entity based
   * on the data.
   * @param entity
   * @param field
   * @param data
   * @returns
   */
  updateRelationField<
    Entity extends BaseEntity,
    Field extends RelationField<Entity>,
  >(entity: Entity, field: Field, data: RelationFieldData<Entity, Field>) {
    this.clearRelation(entity, field);

    if (!data) return;

    const relationMeta = entity[FIELDS][field].relation!;
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
    const relationMeta = entity[FIELDS][field].relation!;
    if (typeof reference == "object") {
      // TODO: Support this
      // specifying inverse relations in nested data is not supported
      delete reference[relationMeta.inverse];
      return this.commit(relationMeta.target(), reference);
    } else {
      return this.retrieve(relationMeta.target(), reference);
    }
  }

  /**
   * Destruct any bilateral relation on the specified field of the entity.
   * @param entity
   * @param field
   */
  clearRelation<Entity extends BaseEntity>(
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

    const relationMeta = entity[FIELDS][field].relation!;
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
    const relationMeta = entity[FIELDS][field].relation;
    if (relationMeta?.multi) {
      if (!onToMany) return;
      const relationEntities = entity[field] as Collection<AnyEntity>;
      onToMany(relationEntities);
    } else {
      if (!onToOne) return;
      const relationEntity = entity[field] as AnyEntity | EmptyValue;
      const processed = onToOne(relationEntity);
      entity[field] = processed;
    }
  }

  // --------------------------------------------------------------------------

  /**
   * Inspect the registered entities.
   */
  private inspect() {
    const buildThrowErr =
      (type: Type) => (field: string | null, msg: string) => {
        throw new Error(`[${type.name}${field ? `:${field}` : ""}] ${msg}`);
      };

    // individual inspection of each entity
    for (const type of this.map.keys()) {
      const throwErr = buildThrowErr(type);

      if (!type.prototype[TYPE])
        throwErr(null, "Entities must be decorated by @Entity()");
      if (!type.prototype[FIELDS])
        throwErr(null, "Entities must have at least one field");
      if (!type.prototype[PRIMARY])
        throwErr(null, "Entities must have a primary key field");

      Object.values(type.prototype[FIELDS]).forEach(({ name, relation }) => {
        if (relation) {
          if (!this.map.has(relation.target()))
            throwErr(name, "The relation entity is not registered");
        }
      });
    }

    // overall inspection
    for (const type of this.map.keys()) {
      const throwErr = buildThrowErr(type);
      Object.values(type.prototype[FIELDS]).forEach(({ name, relation }) => {
        if (relation) {
          const { target, inverse } = relation;
          const inverseMeta = target().prototype[FIELDS][inverse];
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
      });
    }
  }
}
