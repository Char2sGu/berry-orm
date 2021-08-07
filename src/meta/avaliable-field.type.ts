import { BaseEntity } from "../base-entity.class";
import { PrimaryKeyField } from "../primary-key-field.type";
import { ExtractKeys } from "../utils";
import { FieldOptions } from "./field-options.interface";

export type AvailableField<
  Options extends FieldOptions,
  Entity extends BaseEntity<Entity, Primary>,
  Primary extends PrimaryKeyField<Entity>,
> = Options["primary"] extends true
  ? Primary
  : Options["relation"] extends FieldOptions["relation"]
  ? ExtractKeys<Entity, BaseEntity<any, any> | BaseEntity<any, any>[]> & string
  : string;
