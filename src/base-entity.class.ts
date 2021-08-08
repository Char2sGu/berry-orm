import { FieldMeta } from "./meta";
import { PrimaryKeyField } from "./primary-key-field.type";
import { FIELDS, POPULATED, PRIMARY, TYPE } from "./symbols";
import { Type } from "./utils";

export abstract class BaseEntity<
  T extends BaseEntity<T, Primary> = any,
  Primary extends PrimaryKeyField<T> = any,
> {
  [TYPE]: Type<T>;
  [FIELDS]: Record<string, FieldMeta>;
  [PRIMARY]: Primary;
  [POPULATED]: boolean;
}
