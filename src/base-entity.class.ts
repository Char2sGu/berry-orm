import { FieldMeta } from "./meta";
import { PrimaryKeyField } from "./primary-key-field.type";
import { FIELDS, PRIMARY, TYPE } from "./symbols";
import { Type } from "./utils";

export abstract class BaseEntity<
  T extends BaseEntity<T, Primary>,
  Primary extends PrimaryKeyField<T>,
> {
  [TYPE]: Type<T>;
  [FIELDS]: Record<string, FieldMeta>;
  [PRIMARY]: Primary;
}
