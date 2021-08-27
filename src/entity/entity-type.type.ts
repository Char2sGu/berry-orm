import { AnyEntity } from "..";
import { EntityPrimaryKey } from "../field/entity-primary-key.type";
import { Type } from "../utils/type.type";
import { EntityRelationManager } from "./entity-relation-manager.class";

export type EntityType<Entity extends AnyEntity = AnyEntity> = Type<
  Entity,
  [relationManager: EntityRelationManager, primaryKey: EntityPrimaryKey<Entity>]
>;
