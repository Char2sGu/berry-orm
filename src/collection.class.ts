import { BaseEntity } from "./base-entity.class";
import { EntityManager } from "./entity-manager.class";

export class Collection<Entity extends BaseEntity> extends Set<Entity> {
  constructor(private em: EntityManager, private owner: Entity) {
    super();
  }
}
