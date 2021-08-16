import { AnyEntity } from ".";
import { BaseEntity } from "./base-entity.class";
import { EntityData } from "./entity-data.type";
import { PrimaryKey } from "./primary-key.type";

export type RelationEntityRepresentation<
  Entity extends BaseEntity = AnyEntity,
> = PrimaryKey | EntityData<Entity>;
