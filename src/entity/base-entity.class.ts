import { BerryOrm } from "../berry-orm.class";
import { container } from "../container";
import { Collection } from "../field/collection.class";
import { CommonFieldAccessor } from "../field/common.field-accessor";
import { EntityField } from "../field/entity-field.type";
import { PrimaryField } from "../field/primary-field.type";
import { PrimaryFieldAccessor } from "../field/primary.field-accessor";
import { RelationToManyFieldAccessor } from "../field/relation-to-many.field-accessor";
import { RelationToOneFieldAccessor } from "../field/relation-to-one.field-accessor";
import { EntityMeta } from "../meta/entity-meta.interface";
import { META, POPULATED } from "../symbols";

/**
 * The base class of every entity.
 *
 * It is recommended to create an own `BaseEntity`, which extends this one and
 * is defined getters so that the metadata can be accessed more conveniently.
 */
export abstract class BaseEntity<
  Entity extends BaseEntity = any,
  Primary extends PrimaryField<Entity> = any,
> {
  [META]: EntityMeta<Entity, Primary>;

  /**
   * Indicates that the **data** fields (**relation** fields not included) of
   * the this has been populated.
   */
  [POPULATED] = false;

  constructor(private orm: BerryOrm, primaryKey: Entity[Primary]) {
    Object.keys(this[META].fields.items).forEach((field) =>
      this.initField(field as EntityField<Entity>),
    );
    const entity = this as unknown as Entity;
    entity[this[META].fields.primary] = primaryKey;
  }

  /**
   * Apply accessors on the specified field of the this to prevent
   * unexpected bugs and instantiate {@link Collection}s.
   * @param this
   * @param field
   */
  private initField(field: EntityField<Entity>) {
    const entity = this as unknown as Entity;

    const fieldsMeta = entity[META].fields;
    const fieldMeta = fieldsMeta.items[field];

    const isPrimaryField = fieldsMeta.primary == field;
    const isCollectionField = !!fieldMeta.relation?.multi;
    const isRelationEntityField = !!fieldMeta.relation && !isCollectionField;

    const accessor = container.get(
      isPrimaryField
        ? PrimaryFieldAccessor
        : isCollectionField
        ? RelationToManyFieldAccessor
        : isRelationEntityField
        ? RelationToOneFieldAccessor
        : CommonFieldAccessor,
    );
    accessor.apply(this.orm, entity, field);

    if (isCollectionField)
      entity[field] = new Collection(entity.orm, entity, field) as any;
  }
}
