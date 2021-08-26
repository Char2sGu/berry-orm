import { AnyEntity } from "..";
import { PrimaryKey } from "../field/primary-key.type";
import { EntityData } from "./entity-data.type";

export type RelationEntityRepresentation<Entity extends AnyEntity = AnyEntity> =
  PrimaryKey | EntityData<Entity>;
