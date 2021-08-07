import { BaseEntity } from "../base-entity.class";
import { PrimaryKeyField } from "../primary-key-field.type";
import { FIELDS, PRIMARY } from "../symbols";
import { AvailableField } from "./avaliable-field.type";
import { FieldOptions } from "./field-options.interface";

export const Field =
  <Options extends FieldOptions = {}>(
    { primary = false }: Options = {} as Options,
  ) =>
  <T extends BaseEntity<T, Primary>, Primary extends PrimaryKeyField<T>>(
    prototype: T,
    name: AvailableField<Options, T, Primary>,
  ) => {
    let fields = prototype[FIELDS] ?? (prototype[FIELDS] = {});
    fields[name] = { name };
    if (primary) prototype[PRIMARY] = name as Primary;
  };
