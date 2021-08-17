import { AnyEntity } from "..";
import { PrimaryKey } from "../field/primary-key.type";
import { BaseEntity } from "./base-entity.class";
import { EntityData } from "./entity-data.type";

export type RelationEntityRepresentation<
  Entity extends BaseEntity = AnyEntity,
> = PrimaryKey | EntityData<Entity>;
