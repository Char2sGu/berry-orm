import { BaseEntity, EntityManager } from ".";

export class Collection<Entity extends BaseEntity> extends Set<Entity> {
  constructor(private em: EntityManager, private owner: Entity) {
    super();
  }
}
