import { AnyEntity } from "..";
import { EntityRelationManager } from "../entity-relation-manager.class";
import { EntityPrimaryKey } from "../field/entity-primary-key.type";
import { Type } from "../utils/type.type";

export type EntityType<Entity extends AnyEntity = AnyEntity> = Type<
  Entity,
  [relationManager: EntityRelationManager, primaryKey: EntityPrimaryKey<Entity>]
>;
