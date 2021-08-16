import { AnyEntity } from ".";
import { BaseEntity } from "./base-entity.class";
import { EntityType } from "./entity-type.type";

export type RelationTarget<Entity extends BaseEntity = AnyEntity> =
  () => EntityType<Entity>;
