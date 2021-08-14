import { AnyEntity, BaseEntity, Type } from ".";

export type RelationTarget<Entity extends BaseEntity = AnyEntity> =
  () => Type<Entity>;
