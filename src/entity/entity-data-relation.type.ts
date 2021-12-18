import { RelationField } from "../field/field-types/relation-field.type";
import { RelationFieldData } from "../field/relation-field-data.type";
import { AnyEntity } from "./any-entity.type";

export type EntityDataRelation<Entity extends AnyEntity> = {
  [Field in RelationField<Entity>]: RelationFieldData<Entity, Field>;
};
