import { CommonField, PrimaryKey, RelationField } from "../field";
import { BaseEntity } from "./base-entity.class";

// TODO: stricter type
export type EntityData<Entity extends BaseEntity> = Pick<
  Entity,
  CommonField<Entity>
> &
  {
    [K in RelationField<Entity>]?: Entity[K] extends BaseEntity
      ? EntityData<Entity[K]> | PrimaryKey
      : Entity[K] extends BaseEntity[]
      ? EntityData<Entity[K][0]>[] | PrimaryKey[]
      : never;
  };
