import { CommonField, PrimaryKey, RelationField } from "../field";
import { BaseEntity } from "./base-entity.class";

export type EntityData<Entity extends BaseEntity> = Pick<
  Entity,
  CommonField<Entity>
> &
  {
    [K in RelationField<Entity>]?: Entity[K] extends BaseEntity
      ? EntityData<Entity[K]> | PrimaryKey
      : Entity[K] extends Set<BaseEntity>
      ?
          | EntityData<
              Entity[K] extends Set<infer E>
                ? E extends BaseEntity
                  ? E
                  : never
                : never
            >[]
          | PrimaryKey[]
      : never;
  };
