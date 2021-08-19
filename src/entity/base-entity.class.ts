import { container } from "../container";
import { EntityManager } from "../entity-manager.class";
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
  Entity extends BaseEntity<Entity, Primary> = any,
  Primary extends PrimaryField<Entity> = any,
> {
  [META]: EntityMeta<Entity, Primary>;

  /**
   * Indicates that the **data** fields (**relation** fields not included) of
   * the this has been populated.
   */
  [POPULATED] = false;

  constructor(private em: EntityManager, primaryKey: Entity[Primary]) {
    Object.keys(this[META].fields.items).forEach((field) =>
      this.initField(field as EntityField<Entity>),
    );
    const entity = this.asEntity;
    entity[entity[META].fields.primary] = primaryKey;
  }

  private initField(field: EntityField<Entity>) {
    const entity = this.asEntity;

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
    accessor.apply(entity.em, entity, field);

    if (isCollectionField)
      entity[field] = new Collection(entity.em, entity, field) as any;
  }

  private get asEntity() {
    return this as unknown as Entity;
  }
}
