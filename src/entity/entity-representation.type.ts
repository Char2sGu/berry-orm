import { PrimaryKey } from "../field/field-values/primary-key.type";
import { AnyEntity } from "./any-entity.type";
import { EntityData } from "./entity-data/entity-data.type";

export type EntityRepresentation<Entity extends AnyEntity = AnyEntity> =
  | PrimaryKey<Entity>
  | EntityData<Entity>;
