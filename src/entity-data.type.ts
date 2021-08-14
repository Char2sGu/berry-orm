import {
  BaseEntity,
  CommonField,
  EmptyValue,
  RelationField,
  RelationFieldData,
} from ".";

export type EntityData<Entity extends BaseEntity> = Pick<
  Entity,
  CommonField<Entity>
> &
  {
    [K in RelationField<Entity>]?: Entity[K] extends BaseEntity
      ? RelationFieldData<Entity[K]> | EmptyValue
      : Entity[K] extends Set<BaseEntity>
      ? RelationFieldData<
          Entity[K] extends Set<infer E>
            ? E extends BaseEntity
              ? E
              : never
            : never
        >[]
      : never;
  };
