import { FieldMeta } from "./meta";
import { PrimaryKeyField } from "./primary-key-field.type";
import { FIELDS, POPULATED, PRIMARY, TYPE } from "./symbols";
import { Type } from "./utils";

export abstract class BaseEntity<
  Entity extends BaseEntity<Entity, Primary> = any,
  Primary extends PrimaryKeyField<Entity> = any,
> {
  [TYPE]: Type<Entity>;
  [FIELDS]: Record<string, FieldMeta>;
  [PRIMARY]: Primary;
  [POPULATED]: boolean;
}
