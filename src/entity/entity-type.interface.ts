import { BerryOrm } from "../berry-orm.class";
import { PrimaryKey } from "../field/field-values/primary-key.type";
import { AnyEntity } from "./any-entity.type";

export interface EntityType<Entity extends AnyEntity = AnyEntity> {
  new (orm: BerryOrm, primaryKey: PrimaryKey<Entity>): Entity;
  prototype: Entity;
}
