import { BaseEntity } from "./base-entity.class";
import { RelationFieldData } from "./relation-field-data.type";
import { RelationField } from "./relation-field.type";

export type EntityDataRelation<Entity extends BaseEntity> = {
  [Field in RelationField<Entity>]: RelationFieldData<Entity, Field>;
};
