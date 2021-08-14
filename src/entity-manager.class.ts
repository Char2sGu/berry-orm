import {
  AnyEntity,
  BaseEntity,
  EmptyValue,
  EntityData,
  EntityManagerOptions,
  EntityStore,
  FIELDS,
  POPULATED,
  PRIMARY,
  PrimaryKeyField,
  RelationEntityRepresentation,
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

      const relationMeta = entity[FIELDS][field].relation;
      if (!relationMeta) {
        this.defineFieldValue(entity, field, fieldData);
      } else {
        // relation field data is optional
        if (!(field in data)) continue;
        this.updateRelationFieldValue(entity, field, fieldData);
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
      entity = new type();
      entity[POPULATED] = false;
      this.defineFieldValue(entity, entity[PRIMARY], primaryKey);
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
   * Define a getter on the specified field of the entity which
   * returns the value directly.
   * @param entity
   * @param field
   * @param value
   */
  private defineFieldValue(entity: AnyEntity, field: string, value: unknown) {
    Reflect.defineProperty(entity, field, {
      get: () => value,
      configurable: true,
    });
  }

  // --------------------------------------------------------------------------
  // Relation

  private updateRelationFieldValue(
    entity: AnyEntity,
    field: string,
    data: RelationFieldData,
  ) {
    this.clearRelation(entity, field);

    if (!data) return;

    (isToManyData(data) ? data : [data]).forEach((data) => {
      const targetEntity = this.resolveRelationEntityRepresentation(
        entity,
        field,
        data,
      );
      this.constructRelation(entity, field, targetEntity);
    });

    function isToManyData(
      data: unknown,
    ): data is RelationEntityRepresentation[] {
      const relationMeta = entity[FIELDS][field].relation!;
      return !!relationMeta.multi;
    }
  }

  /**
   * Get the target relation entity from a primary key or a data object.
   * @param entity
   * @param field
   * @param reference
   * @returns
   */
  private resolveRelationEntityRepresentation(
    entity: AnyEntity,
    field: string,
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
  private clearRelation(entity: AnyEntity, field: string) {
    this.invokeOnRelationField(
      entity,
      field,
      (relationEntity) => {
        if (!relationEntity) return;
        this.destructRelation(entity, field, relationEntity);
        return undefined;
      },
      (relationEntities) => {
        if (!relationEntities) return;
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
  private constructRelation(
    entity: AnyEntity,
    field: string,
    targetEntity: AnyEntity,
  ) {
    this.invokeOnRelationFieldBilateral(
      entity,
      field,
      targetEntity,
      (targetEntity) => targetEntity,
      (targetEntity, entities) => (entities ?? new Set()).add(targetEntity),
    );
  }

  /**
   * Destruct the bilateral relation with the target entity on the specified
   * field of the entity if exists.
   * @param entity
   * @param field
   * @param targetEntity
   */
  private destructRelation(
    entity: AnyEntity,
    field: string,
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
      entities: Set<AnyEntity> | EmptyValue,
    ) => Set<AnyEntity> | EmptyValue,
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
   * Invoke a callback based on the field's relation type and use the return
   * value to update the field's value.
   * @param entity
   * @param field
   * @param onToOne - The callback to be invoked on a to-one relation field.
   * @param onToMany - The callback to be invoked on a to-many relation field.
   */
  private invokeOnRelationField(
    entity: AnyEntity,
    field: string,
    onToOne?: (entity: AnyEntity | EmptyValue) => AnyEntity | EmptyValue,
    onToMany?: (
      entities: Set<AnyEntity> | EmptyValue,
    ) => Set<AnyEntity> | EmptyValue,
  ) {
    const relationMeta = entity[FIELDS][field].relation;
    if (relationMeta?.multi) {
      if (!onToMany) return;
      const relationEntities = entity[field] as Set<AnyEntity> | EmptyValue;
      const processed = onToMany(relationEntities);
      this.defineFieldValue(entity, field, processed);
    } else {
      if (!onToOne) return;
      const relationEntity = entity[field] as AnyEntity | EmptyValue;
      const processed = onToOne(relationEntity);
      this.defineFieldValue(entity, field, processed);
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
