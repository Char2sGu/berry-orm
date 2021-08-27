import { AnyEntity } from "../entity/any-entity.type";
import { EntityRelationManager } from "../entity/entity-relation-manager.class";

export class Collection<Entity extends AnyEntity> extends Set<Entity> {
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
