import { BaseEntity } from "../entity/base-entity.class";
import { ExtractKeys } from "../utils/extract-keys.type";
import { CommonField } from "./common-field.type";
import { PrimaryKey } from "./primary-key.type";

export type PrimaryKeyField<Entity extends BaseEntity> = Extract<
  CommonField<Entity>,
  ExtractKeys<Entity, PrimaryKey>
>;
