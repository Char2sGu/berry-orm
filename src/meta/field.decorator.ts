import { BaseEntity } from "../base-entity.class";
import { PrimaryKeyField } from "../primary-key-field.type";
import { FIELDS, PRIMARY } from "../symbols";
import { FieldOptions } from "./field-options.interface";

export const Field =
  <Options extends FieldOptions>(
    { primary = false }: Options = {} as Options,
  ) =>
  <T extends BaseEntity<T, Primary>, Primary extends PrimaryKeyField<T>>(
    prototype: T,
    name: Options["primary"] extends true ? Primary : string,
  ) => {
    let fields = prototype[FIELDS] ?? (prototype[FIELDS] = {});
    fields[name] = { name };
    if (primary) prototype[PRIMARY] = name as Primary;
  };
