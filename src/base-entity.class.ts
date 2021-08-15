import {
  FieldMeta,
  FIELDS,
  POPULATED,
  PRIMARY,
  PrimaryKeyField,
  TYPE,
  Type,
} from ".";

/**
 * The base class of every entities, providing type support.
 *
 * It is recommended to create an own `BaseEntity`, which extends this one and
 * is defined getters so that the metadata can be accessed more conveniently.
 */
export abstract class BaseEntity<
  Entity extends BaseEntity = any,
  Primary extends PrimaryKeyField<Entity> = any,
> {
  /**
   * A short cut of `this.constructor as Type<Entity>`
   */
  [TYPE]: Type<Entity>;
  /**
   * Meta of the fields of the entity.
   */
  [FIELDS]: Record<string, FieldMeta>;
  /**
   * The primary key field of the entity.
   */
  [PRIMARY]: Primary;
  /**
   * Indicates that the **data** fields (**relation** fields not included) of
   * the entity has been populated.
   */
  [POPULATED]: boolean;
}
