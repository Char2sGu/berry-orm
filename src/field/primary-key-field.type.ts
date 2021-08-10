import { BaseEntity } from "../entity";
import { ExtractKeys } from "../utils";
import { CommonField } from "./common-field.type";
import { PrimaryKey } from "./primary-key.type";

export type PrimaryKeyField<Entity extends BaseEntity> = Extract<
  CommonField<Entity>,
  ExtractKeys<Entity, PrimaryKey>
>;
