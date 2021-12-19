import { AnyEntity, ExtractKeys } from "../..";
import { PrimaryKeyPossible } from "../field-values/primary-key-possible.type";
import { EntityFieldBase } from "./entity-field-base.type";

export type PrimaryFieldPossible<Entity extends AnyEntity<Entity>> = Extract<
  EntityFieldBase<Entity>,
  {
    [Type in PrimaryKeyPossible]: ExtractKeys<Entity, Type>;
  }[PrimaryKeyPossible]
>;
