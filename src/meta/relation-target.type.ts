import { AnyEntity } from "../any-entity.type";
import { BaseEntity } from "../base-entity.class";
import { Type } from "../utils";

export type RelationTarget<Entity extends BaseEntity = AnyEntity> =
  () => Type<Entity>;
