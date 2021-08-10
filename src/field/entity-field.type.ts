import { BaseEntity } from "../entity";
import { ExcludeKeys } from "../utils";

export type EntityField<Entity extends BaseEntity> = string &
  ExcludeKeys<Entity, Function>;
