import { Collection } from "../field/collection.class";
import { CommonFieldAccessor } from "../field/common.field-accessor";
import { EntityField } from "../field/entity-field.type";
import { PrimaryField } from "../field/primary-field.type";
import { PrimaryFieldAccessor } from "../field/primary.field-accessor";
import { RelationField } from "../field/relation-field.type";
import { RelationToManyFieldAccessor } from "../field/relation-to-many.field-accessor";
import { RelationToOneFieldAccessor } from "../field/relation-to-one.field-accessor";
import { EntityMeta } from "../meta/entity-meta.class";
import { META, POPULATED } from "../symbols";
import { AnyEntity } from "./any-entity.type";
import { EntityType } from "./entity-type.type";

// It's not possible to use Active Record mode in Berry ORM because type
// circular reference will happen and cause compile error.

/**
 * The base class of every entity.
 *
 * It is recommended to create an own `BaseEntity`, which extends this one and
 * is defined getters so that the metadata can be accessed more conveniently.
 */
export abstract class BaseEntity<
  Entity extends AnyEntity<Entity, Primary>,
  Primary extends PrimaryField<Entity>,
> {
  // optional, because the entity may not have a decorator applied
  [META]?: EntityMeta<Entity, Primary>;

  /**
   * Indicates that the **data** fields (**relation** fields not included) of
   * the this has been populated.
   */
  [POPULATED] = false;

  private relationManager;

  constructor(
    ...[relationManager, primaryKey]: ConstructorParameters<EntityType<Entity>>
  ) {
    this.relationManager = relationManager;
    Object.keys(this[META]!.fields).forEach((field) =>
      this.initField(field as EntityField<Entity>),
    );
    const entity = this.asEntity;
    entity[this[META]!.primary] = primaryKey;
  }

  private initField(field: EntityField<Entity>) {
    const entity = this.asEntity;

    const isPrimaryField = this[META]!.primary == field;
    const isCollectionField = !!this[META]!.fields[field].relation?.multi;
    const isRelationEntityField =
      !!this[META]!.fields[field].relation && !isCollectionField;

    const accessor = isPrimaryField
      ? new PrimaryFieldAccessor(this.relationManager, entity, field as Primary)
      : isCollectionField
      ? new RelationToManyFieldAccessor(
          this.relationManager,
          entity,
          field as RelationField<Entity>,
        )
      : isRelationEntityField
      ? new RelationToOneFieldAccessor(
          this.relationManager,
          entity,
          field as RelationField<Entity>,
        )
      : new CommonFieldAccessor(this.relationManager, entity, field);

    accessor.apply();

    if (isCollectionField)
      entity[field] = new Collection(
        entity.relationManager,
        entity,
        field,
      ) as unknown as Entity[EntityField<Entity>];
  }

  private get asEntity() {
    return this as unknown as Entity;
  }
}
