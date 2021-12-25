import { MatchedKeys } from "../../common/matched-keys.type";
import { AnyEntity } from "../../entity/any-entity.type";
import { PrimaryKeyPossible } from "../field-values/primary-key-possible.type";
import { EntityFieldBase } from "./entity-field-base.type";

export type PrimaryFieldPossible<Entity extends AnyEntity<Entity>> = Extract<
  EntityFieldBase<Entity>,
  {
    [Type in PrimaryKeyPossible]: MatchedKeys<Entity, Type>;
  }[PrimaryKeyPossible]
>;
