import { BerryOrm, PrimaryFieldPossible } from "..";
import { CommonFieldAccessor } from "../field/field-accessors/common-field.accessor";
import { PrimaryFieldAccessor } from "../field/field-accessors/primary-field.accessor";
import { RelationFieldToManyAccessor } from "../field/field-accessors/relation-field-to-many.accessor";
import { RelationFieldToOneAccessor } from "../field/field-accessors/relation-field-to-one.accessor";
import { CommonField } from "../field/field-names/common-field.type";
import { EntityField } from "../field/field-names/entity-field.type";
import { PrimaryField } from "../field/field-names/primary-field.type";
import { RelationFieldToMany } from "../field/field-names/relation-field-to-many.type";
import { RelationFieldToOne } from "../field/field-names/relation-field-to-one.type";
import { PrimaryKey } from "../field/field-values/primary-key.type";
import { EntityMeta } from "../meta/meta-objects/entity-meta.class";
import { META, RESOLVED, VERSION } from "../symbols";
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
  Entity extends BaseEntity<Entity, Primary>,
  Primary extends PrimaryFieldPossible<Entity>,
> {
  private static init<Entity extends AnyEntity<Entity>>(
    orm: BerryOrm,
    entity: Entity,
    primaryKey: PrimaryKey<Entity>,
  ) {
    entity[VERSION] = orm.version;
    for (const field of Object.keys(entity[META].fields))
      this.initField(orm, entity, field as EntityField<Entity>);
    entity[entity[META].primary] = primaryKey;
  }

  private static initField<Entity extends AnyEntity<Entity>>(
    orm: BerryOrm,
    entity: Entity,
    field: EntityField<Entity>,
  ) {
    const isPrimary = entity[META].primary == field;
    const isToMany = !!entity[META].fields[field].relation?.multi;
    const isToOne = !!entity[META].fields[field].relation && !isToMany;

    const accessor = isPrimary
      ? new PrimaryFieldAccessor(orm, entity, field as PrimaryField<Entity>)
      : isToMany
      ? new RelationFieldToManyAccessor(
          orm,
          entity,
          field as RelationFieldToMany<Entity>,
        )
      : isToOne
      ? new RelationFieldToOneAccessor(
          orm,
          entity,
          field as RelationFieldToOne<Entity>,
        )
      : new CommonFieldAccessor(orm, entity, field as CommonField<Entity>);

    accessor.apply();
  }

  /**
   * Definition metadata of this entity type.
   *
   * Potentially `undefined` because it only exists when there are at least one
   * decorator applied.
   */
  [META]: EntityMeta<Entity, Primary>;

  /**
   * Indicates that the **data** fields (**relation** fields not included) of
   * the this has been populated.
   */
  [RESOLVED] = false;

  /**
   * The ORM version of this entity which is used to prevent operations on
   * expired entities.
   */
  [VERSION]: number;

  constructor(...[orm, primaryKey]: ConstructorParameters<EntityType<Entity>>) {
    BaseEntity.init(orm, this as unknown as Entity, primaryKey);
  }
}
