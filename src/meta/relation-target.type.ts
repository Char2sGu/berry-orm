import { AnyEntity } from "..";
import { BaseEntity } from "../entity/base-entity.class";
import { EntityType } from "../entity/entity-type.type";

export type RelationTarget<Entity extends BaseEntity = AnyEntity> =
  () => EntityType<Entity>;
