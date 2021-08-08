import { BaseEntity } from "../base-entity.class";
import { Type } from "../utils";

export type RelationTarget<T extends BaseEntity<T> = BaseEntity> =
  () => Type<T>;
