import { RelationFieldData } from "../../field/field-data/relation-field-data.type";
import { RelationField } from "../../field/field-names/relation-field.type";
import { AnyEntity } from "../any-entity.type";

export type EntityDataRelational<Entity extends AnyEntity<Entity>> = {
  [Field in RelationField<Entity>]: RelationFieldData<Entity, Field>;
};
