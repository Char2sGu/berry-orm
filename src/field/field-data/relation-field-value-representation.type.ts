import { AnyEntity } from "../../entity/any-entity.type";
import { EntityData } from "../../entity/entity-data/entity-data.type";
import { PrimaryKeyPossible } from "../field-values/primary-key-possible.type";

export type RelationFieldValueRepresentation<
  Entity extends AnyEntity<Entity> = AnyEntity,
> = PrimaryKeyPossible | EntityData<Entity>;
