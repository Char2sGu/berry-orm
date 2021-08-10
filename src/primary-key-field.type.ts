import { BaseEntity } from "./base-entity.class";
import { CommonField } from "./common-field.type";
import { PrimaryKey } from "./primary-key.type";
import { ExtractKeys } from "./utils";

export type PrimaryKeyField<Entity extends BaseEntity> = Extract<
  CommonField<Entity>,
  ExtractKeys<Entity, PrimaryKey>
>;
