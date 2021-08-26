import { EntityRelationManager } from "../entity-relation-manager.class";
import { AnyEntity } from "../entity/any-entity.type";
import { BaseEntity } from "../entity/base-entity.class";

export class Collection<Entity extends BaseEntity> extends Set<Entity> {
  constructor(
    private relationManager: EntityRelationManager,
    private owner: AnyEntity,
    private field: string,
  ) {
    super();
  }

  add(entity: Entity): this {
    // end up recursion
    if (!this.has(entity)) {
      super.add(entity);
      this.relationManager.constructRelation(this.owner, this.field, entity);
    }
    return this;
  }

  delete(entity: Entity): boolean {
    // end up recursion
    if (this.has(entity)) {
      super.delete(entity);
      this.relationManager.destructRelation(this.owner, this.field, entity);
      return true;
    }
    return false;
  }

  clear(): void {
    this.relationManager.clearRelations(this.owner, this.field);
  }
}
