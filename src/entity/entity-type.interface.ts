import { BerryOrm } from "../berry-orm.class";
import { EntityPrimaryKey } from "../field/entity-primary-key.type";
import { Type } from "../utils/type.interface";
import { AnyEntity } from "./any-entity.type";

export interface EntityType<Entity extends AnyEntity = AnyEntity>
  extends Type<Entity> {
  new (orm: BerryOrm, primaryKey: EntityPrimaryKey<Entity>): Entity;
}
