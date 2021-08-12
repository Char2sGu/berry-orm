import { AnyEntity, BaseEntity } from "../entity";
import { PrimaryKey } from "../field";
import { EntityData } from "./entity-data.type";

export type RelationFieldData<Entity extends BaseEntity = AnyEntity> =
  | PrimaryKey
  | EntityData<Entity>;
