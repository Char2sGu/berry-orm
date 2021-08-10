import { BaseEntity } from "./base-entity.class";
import { ExcludeKeys } from "./utils";

export type EntityField<Entity extends BaseEntity> = string &
  ExcludeKeys<Entity, Function>;
