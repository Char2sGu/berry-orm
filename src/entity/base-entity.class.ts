import { Collection } from "../field/collection.class";
import { CommonFieldAccessor } from "../field/common.field-accessor";
import { EntityField } from "../field/entity-field.type";
import { PrimaryFieldAccessor } from "../field/primary.field-accessor";
import { PrimaryField } from "../field/primary-field.type";
import { RelationField } from "../field/relation-field.type";
import { RelationToManyFieldAccessor } from "../field/relation-to-many.field-accessor";
import { RelationToOneFieldAccessor } from "../field/relation-to-one.field-accessor";
import { EntityMeta } from "../meta/entity-meta.class";
import { META, POPULATED } from "../symbols";
import { AnyEntity } from "./any-entity.type";
import { EntityType } from "./entity-type.interface";

// It's not possible to use Active Record mode in Berry ORM because type
// circular reference will happen and cause compile error.

// It's also impossible to implement a `@Serializer()` decorator, because
// the serializer type should be accessible in other part of this lib to infer
// the data type properly, which is impossible in decorators.
// By the way, defining a static property `serializers` will not be implemented
// because this will make type inference much more difficult because the
// auto-inference supports only one level, and this will also make the style
// become messy because we used both static properties and decorators to define
// metadata for fields.

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
  /**
   * Definition metadata of this entity type.
   *
   * It is marked as _optional_ because it only exists when there are at least
   * one decorator applied.
   */
  [META]?: EntityMeta<Entity, Primary>;

  /**
   * Indicates that the **data** fields (**relation** fields not included) of
   * the this has been populated.
   */
  [POPULATED] = false;

  private readonly relationManager;

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
