import { AnyEntity, ExtractKeys } from "../..";
import { PrimaryKey } from "../field-values/primary-key.type";
import { EntityFieldBase } from "./entity-field-base.type";

export type PrimaryFieldPossible<Entity extends AnyEntity> = Extract<
  EntityFieldBase<Entity>,
  { [Type in PrimaryKey]: ExtractKeys<Entity, Type> }[PrimaryKey]
>;
