import { AnyEntity } from "..";
import { EntityRelationManager } from "../entity-relation-manager.class";
import { EntityPrimaryKey } from "../field/entity-primary-key.type";
import { Type } from "../utils/type.type";
import { BaseEntity } from "./base-entity.class";

export type EntityType<Entity extends BaseEntity = AnyEntity> = Type<
  Entity,
  [relationManager: EntityRelationManager, primaryKey: EntityPrimaryKey<Entity>]
>;
