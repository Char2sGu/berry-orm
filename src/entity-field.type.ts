import { BaseEntity } from "./base-entity.class";
import { ExcludeKeys } from "./utils";

export type EntityField<Entity extends BaseEntity<Entity>> = string &
  ExcludeKeys<Entity, Function>;
