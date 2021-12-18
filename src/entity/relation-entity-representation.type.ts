import { AnyEntity } from "../entity/any-entity.type";
import { PrimaryKey } from "../field/field-values/primary-key.type";
import { EntityData } from "./entity-data/entity-data.type";

export type RelationEntityRepresentation<Entity extends AnyEntity = AnyEntity> =
  PrimaryKey | EntityData<Entity>;
