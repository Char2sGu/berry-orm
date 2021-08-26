import { AnyEntity } from "../entity/any-entity.type";
import { EntityType } from "../entity/entity-type.type";

export type RelationTarget<Entity extends AnyEntity = AnyEntity> =
  () => EntityType<Entity>;
