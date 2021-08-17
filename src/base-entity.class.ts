import { BaseFieldAccessor } from "./base.field-accessor";
import { BerryOrm } from "./berry-orm.class";
import { Collection } from "./collection.class";
import { container } from "./container";
import { EntityField } from "./entity-field.type";
import { EntityMeta } from "./meta/entity-meta.interface";
import { PrimaryKeyField } from "./primary-key-field.type";
import { PrimaryFieldAccessor } from "./primary.field-accessor";
import { META, POPULATED } from "./symbols";
import { ToManyFieldAccessor } from "./to-many.field-accessor";
import { RelationEntityFieldAccessor } from "./to-one.field-accessor";

/**
 * The base class of every entities.
 *
 * It is recommended to create an own `BaseEntity`, which extends this one and
 * is defined getters so that the metadata can be accessed more conveniently.
 */
export abstract class BaseEntity<
  Entity extends BaseEntity = any,
  Primary extends PrimaryKeyField<Entity> = any,
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

    const isPrimaryKeyField = fieldsMeta.primary == field;
    const isCollectionField = !!fieldMeta.relation?.multi;
    const isRelationEntityField = !!fieldMeta.relation && !isCollectionField;

    const accessor = container.get(
      isPrimaryKeyField
        ? PrimaryFieldAccessor
        : isCollectionField
        ? ToManyFieldAccessor
        : isRelationEntityField
        ? RelationEntityFieldAccessor
        : BaseFieldAccessor,
    );
    accessor.apply(this.orm, entity, field);

    if (isCollectionField)
      entity[field] = new Collection(entity.orm, entity) as any;
  }
}
