import { BerryOrm } from "../berry-orm.class";
import { EntityPrimaryKey } from "../field/entity-primary-key.type";
import { AnyEntity } from "./any-entity.type";

export interface EntityType<Entity extends AnyEntity = AnyEntity> {
  new (orm: BerryOrm, primaryKey: EntityPrimaryKey<Entity>): Entity;
  prototype: Entity;
}
