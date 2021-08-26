import { RelationFieldData } from "../field/relation-field-data.type";
import { RelationField } from "../field/relation-field.type";
import { AnyEntity } from "./any-entity.type";

export type EntityDataRelation<Entity extends AnyEntity> = {
  [Field in RelationField<Entity>]: RelationFieldData<Entity, Field>;
};
