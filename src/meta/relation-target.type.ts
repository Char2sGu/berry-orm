import { BaseEntity } from "../base-entity.class";
import { Type } from "../utils";

export type RelationTarget<Entity extends BaseEntity<Entity> = BaseEntity> =
  () => Type<Entity>;
