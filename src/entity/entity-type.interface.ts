import { EntityPrimaryKey } from "../field/entity-primary-key.type";
import { Type } from "../utils/type.interface";
import { AnyEntity } from "./any-entity.type";
import { EntityRelationManager } from "./entity-relation-manager.class";

export interface EntityType<Entity extends AnyEntity = AnyEntity>
  extends Type<Entity> {
  new (
    relationManager: EntityRelationManager,
    primaryKey: EntityPrimaryKey<Entity>,
  ): Entity;
}
