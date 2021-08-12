import { PrimaryKeyField } from "../field";
import { FieldMeta } from "../meta";
import { FIELDS, POPULATED, PRIMARY, TYPE } from "../symbols";
import { Type } from "../utils";

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
