import { AnyEntity } from "./entity/any-entity.type";
import { BaseEntity } from "./entity/base-entity.class";
import { EntityData } from "./entity/entity-data.type";
import { EntityType } from "./entity/entity-type.type";
import { IdentityMapManager } from "./entity/identity-map-manager.class";
import { RelationEntityRepresentation } from "./entity/relation-entity-representation.type";
import { Collection } from "./field/collection.class";
import { EmptyValue } from "./field/empty-value.type";
import { PrimaryField } from "./field/primary-field.type";
import { RelationFieldData } from "./field/relation-field-data.type";
import { RelationField } from "./field/relation-field.type";
import { META, POPULATED } from "./symbols";

export class EntityManager {
  constructor(private identityMapManager: IdentityMapManager) {}

  /**
   * Clear the identity maps.
   */
  clear() {
    this.identityMapManager.clear();
  }

  /**
   * Populate the entity using the data.
   * @param type
   * @param data
   * @returns
   */
  populate<
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryField<Entity>,
  >(type: EntityType<Entity>, data: EntityData<Entity>) {
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
   * Return the entity from the identity map if it exists, otherwise create an
   * unpopulated one in the identity map and return it.
   *
   * @param type
   * @param primaryKey
   * @returns
   */
  retrieve<
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryField<Entity>,
  >(type: EntityType<Entity>, primaryKey: Entity[Primary]) {
    const map = this.identityMapManager.get(type);
    let entity = map.get(primaryKey) as Entity | undefined;
    if (!entity) {
      entity = new type(this, primaryKey);
      map.set(primaryKey, entity);
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
   * The return value will be set as the value of the field.
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
      entity[field] = processed;
    }
  }
}
