import { AnyEntity } from "../entity/any-entity.type";
import { ExtractKeys } from "../utils/extract-keys.type";
import { CommonField } from "./common-field.type";
import { PrimaryKey } from "./primary-key.type";

export type PrimaryField<Entity extends AnyEntity> = Extract<
  CommonField<Entity>,
  { [Type in PrimaryKey]: ExtractKeys<Entity, Type> }[PrimaryKey]
>;
