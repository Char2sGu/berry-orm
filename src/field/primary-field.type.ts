import { AnyEntity } from "../entity/any-entity.type";
import { ExtractKeys } from "../utils/extract-keys.type";
import { CommonField } from "./common-field.type";
import { PrimaryKey } from "./primary-key.type";

export type PrimaryField<Entity extends AnyEntity> = Extract<
  CommonField<Entity>,
  ExtractKeys<Entity, PrimaryKey>
>;
