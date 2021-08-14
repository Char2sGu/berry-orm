import { BaseEntity, CommonField, RelationField, RelationFieldData } from ".";

export type EntityData<Entity extends BaseEntity> = Pick<
  Entity,
  CommonField<Entity>
> &
  {
    [Field in RelationField<Entity>]?: RelationFieldData<Entity, Field>;
  };
