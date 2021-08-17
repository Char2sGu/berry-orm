import { BerryOrm } from "../berry-orm.class";
import { AnyEntity } from "../entity/any-entity.type";
import { BaseEntity } from "../entity/base-entity.class";

export class Collection<Entity extends BaseEntity> extends Set<Entity> {
  constructor(
    private orm: BerryOrm,
    private owner: AnyEntity,
    private field: string,
  ) {
    super();
  }

  add(entity: Entity) {
    // end up recursion
    if (!this.has(entity)) {
      super.add(entity);
      this.orm.constructRelation(this.owner, this.field, entity);
    }
    return this;
  }

  delete(entity: Entity) {
    // end up recursion
    if (this.has(entity)) {
      super.delete(entity);
      this.orm.destructRelation(this.owner, this.field, entity);
      return true;
    }
    return false;
  }

  clear() {
    this.orm.clearRelations(this.owner, this.field);
  }
}
