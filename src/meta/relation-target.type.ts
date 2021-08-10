import { AnyEntity, BaseEntity } from "../entity";
import { Type } from "../utils";

export type RelationTarget<Entity extends BaseEntity = AnyEntity> =
  () => Type<Entity>;
