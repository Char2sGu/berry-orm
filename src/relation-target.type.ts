import { AnyEntity } from ".";
import { BaseEntity } from "./base-entity.class";
import { Type } from "./utils/type.type";

export type RelationTarget<Entity extends BaseEntity = AnyEntity> =
  () => Type<Entity>;
