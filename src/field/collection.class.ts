import { BerryOrm } from "../berry-orm.class";
import { BaseEntity } from "../entity/base-entity.class";

export class Collection<Entity extends BaseEntity> extends Set<Entity> {
  constructor(private orm: BerryOrm, private owner: Entity) {
    super();
  }
}
