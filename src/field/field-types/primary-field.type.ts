import { AnyEntity, ExtractKeys } from "../..";
import { PrimaryKey } from "../primary-key.type";
import { CommonField } from "./common-field.type";

export type PrimaryField<Entity extends AnyEntity> = Extract<
  CommonField<Entity>,
  { [Type in PrimaryKey]: ExtractKeys<Entity, Type> }[PrimaryKey]
>;
