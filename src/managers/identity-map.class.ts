import { BerryOrm } from "../berry-orm.class";
import { AnyEntity } from "../entity/any-entity.type";
import { EntityType } from "../entity/entity-type.interface";
import { EntityPrimaryKey } from "../field/entity-primary-key.type";

export class IdentityMap<Entity extends AnyEntity> extends Map<
  EntityPrimaryKey<Entity>,
  Entity
> {
  constructor(private orm: BerryOrm, private type: EntityType<Entity>) {
    super();
  }

  get(key: EntityPrimaryKey<Entity>): Entity {
    let entity = super.get(key);
    if (!entity) {
      entity = new this.type(this.orm, key);
      this.set(key, entity);
    }
    return entity;
  }
}
