import { EntityRelationManager } from "./entity-relation-manager.class";
import { BaseEntity } from "./entity/base-entity.class";
import { EntityType } from "./entity/entity-type.type";
import { EntityPrimaryKey } from "./field/entity-primary-key.type";

export class IdentityMap<Entity extends BaseEntity> extends Map<
  EntityPrimaryKey<Entity>,
  Entity
> {
  constructor(
    private type: EntityType<Entity>,
    private relationManager: EntityRelationManager,
  ) {
    super();
  }

  get(key: EntityPrimaryKey<Entity>): Entity {
    let entity = super.get(key);
    if (!entity) {
      entity = new this.type(this.relationManager, key);
      this.set(key, entity);
    }
    return entity;
  }
}
