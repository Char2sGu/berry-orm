import { AnyEntity } from "../../entity/any-entity.type";
import { EntityData } from "../../entity/entity-data/entity-data.type";
import { PrimaryKey } from "../field-values/primary-key.type";

export type RelationFieldValueRepresentation<
  Entity extends AnyEntity = AnyEntity,
> = PrimaryKey | EntityData<Entity>;
