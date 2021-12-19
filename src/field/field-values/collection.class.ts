import { BerryOrm } from "../../berry-orm.class";
import { AnyEntity } from "../../entity/any-entity.type";

export class Collection<Entity extends AnyEntity<Entity>> extends Set<Entity> {
  constructor(
    private orm: BerryOrm,
    private owner: AnyEntity,
    private field: string,
  ) {
    super();
  }

  add(entity: Entity): this {
    // end up recursion
    if (!this.has(entity)) {
      super.add(entity);
      this.orm.rm.constructRelation(this.owner, this.field, entity);
    }
    return this;
  }

  delete(entity: Entity): boolean {
    // end up recursion
    if (this.has(entity)) {
      super.delete(entity);
      this.orm.rm.destructRelation(this.owner, this.field, entity);
      return true;
    }
    return false;
  }

  clear(): void {
    this.orm.rm.clearRelations(this.owner, this.field);
  }
}
