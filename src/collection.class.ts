import { BaseEntity } from "./base-entity.class";
import { BerryOrm } from "./berry-orm.class";

export class Collection<Entity extends BaseEntity> extends Set<Entity> {
  constructor(private orm: BerryOrm, private owner: Entity) {
    super();
  }
}
