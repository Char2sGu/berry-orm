import { BaseEntity, ExcludeKeys } from ".";

export type EntityField<Entity extends BaseEntity> = string &
  ExcludeKeys<Entity, Function>;
