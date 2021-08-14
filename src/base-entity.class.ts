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
  [TYPE]: Type<Entity>;
  [FIELDS]: Record<string, FieldMeta>;
  [PRIMARY]: Primary;
  [POPULATED]: boolean;
}
