import { ExcludeKeys } from "../../common/exclude-keys.type";
import { AnyEntity } from "../../entity/any-entity.type";

export type EntityFieldBase<Entity extends AnyEntity<Entity>> = Extract<
  // eslint-disable-next-line @typescript-eslint/ban-types
  ExcludeKeys<Entity, Function>,
  string
>;
