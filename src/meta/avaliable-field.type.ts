import { BaseEntity } from "../base-entity.class";
import { PrimaryKeyField } from "../primary-key-field.type";
import { ExtractKeys } from "../utils";
import { FieldMeta } from "./field-meta.interface";
import { FieldOptions } from "./field-options.interface";

export type AvailableField<
  Options extends FieldOptions,
  Entity extends BaseEntity<Entity, Primary>,
  Primary extends PrimaryKeyField<Entity>,
> = Options["primary"] extends true
  ? Primary
  : Options["relation"] extends NonNullable<FieldMeta["relation"]>
  ? Options["relation"]["multi"] extends true
    ? ExtractKeys<Entity, BaseEntity[]> & string
    : ExtractKeys<Entity, BaseEntity> & string
  : string;
