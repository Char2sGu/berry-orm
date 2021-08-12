import { BaseEntity } from "../entity";
import { CommonField, RelationField } from "../field";
import { RelationFieldData } from "./relation-field-data.type";

export type EntityData<Entity extends BaseEntity> = Pick<
  Entity,
  CommonField<Entity>
> &
  {
    [K in RelationField<Entity>]?: Entity[K] extends BaseEntity
      ? RelationFieldData<Entity[K]>
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
