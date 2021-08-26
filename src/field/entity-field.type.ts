import { AnyEntity } from "../entity/any-entity.type";
import { ExcludeKeys } from "../utils/exclude-keys.type";

export type EntityField<Entity extends AnyEntity> = string &
  // We are excluding Functions here, so it's fine to be generic
  // eslint-disable-next-line @typescript-eslint/ban-types
  ExcludeKeys<Entity, Function>;
