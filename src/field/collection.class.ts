import { EntityManager } from "../entity-manager.class";
import { AnyEntity } from "../entity/any-entity.type";
import { BaseEntity } from "../entity/base-entity.class";

export class Collection<Entity extends BaseEntity> extends Set<Entity> {
  constructor(
    private em: EntityManager,
    private owner: AnyEntity,
    private field: string,
  ) {
    super();
  }

  add(entity: Entity): this {
    // end up recursion
    if (!this.has(entity)) {
      super.add(entity);
      this.em.constructRelation(this.owner, this.field, entity);
    }
    return this;
  }

  delete(entity: Entity): boolean {
    // end up recursion
    if (this.has(entity)) {
      super.delete(entity);
      this.em.destructRelation(this.owner, this.field, entity);
      return true;
    }
    return false;
  }

  clear(): void {
    this.em.clearRelations(this.owner, this.field);
  }
}
