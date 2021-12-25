import { UnmatchedKeys } from "../../common/unmatched-keys.type";
import { AnyEntity } from "../../entity/any-entity.type";

export type EntityFieldBase<Entity extends AnyEntity> = Extract<
  // eslint-disable-next-line @typescript-eslint/ban-types
  UnmatchedKeys<Entity, Function>,
  string
>;
