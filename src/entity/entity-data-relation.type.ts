import { RelationFieldData } from "../field/relation-field-data.type";
import { RelationField } from "../field/relation-field.type";
import { BaseEntity } from "./base-entity.class";

export type EntityDataRelation<Entity extends BaseEntity> = {
  [Field in RelationField<Entity>]: RelationFieldData<Entity, Field>;
};
