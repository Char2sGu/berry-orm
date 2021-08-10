import { PrimaryKeyField } from "../field";
import { FieldMeta } from "../meta";
import { FIELDS, POPULATED, PRIMARY, TYPE } from "../symbols";
import { Type } from "../utils";

/**
 * The base class of every entities, providing type support.
 *
 * If the user is going to take advantage of these metadata,
 * it is recommended to create an own `BaseEntity` which has
 * getters to get the metadata more conveniently.
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
