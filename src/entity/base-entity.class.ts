import { EntityRelationManager } from "../entity-relation-manager.class";
import { Collection } from "../field/collection.class";
import { CommonFieldAccessor } from "../field/common.field-accessor";
import { EntityField } from "../field/entity-field.type";
import { PrimaryField } from "../field/primary-field.type";
import { PrimaryFieldAccessor } from "../field/primary.field-accessor";
import { RelationField } from "../field/relation-field.type";
import { RelationToManyFieldAccessor } from "../field/relation-to-many.field-accessor";
import { RelationToOneFieldAccessor } from "../field/relation-to-one.field-accessor";
import { EntityMeta } from "../meta/entity-meta.interface";
import { META, POPULATED } from "../symbols";
import { AnyEntity } from "./any-entity.type";

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
  [META]: EntityMeta<Entity, Primary>;

  /**
   * Indicates that the **data** fields (**relation** fields not included) of
   * the this has been populated.
   */
  [POPULATED] = false;

  constructor(
    private relationManager: EntityRelationManager,
    primaryKey: Entity[Primary],
  ) {
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
