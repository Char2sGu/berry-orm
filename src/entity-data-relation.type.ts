import { BaseEntity, RelationField, RelationFieldData } from ".";

export type EntityDataRelation<Entity extends BaseEntity> = {
  [Field in RelationField<Entity>]: RelationFieldData<Entity, Field>;
};
