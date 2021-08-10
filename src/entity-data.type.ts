import { BaseEntity } from "./base-entity.class";
import { CommonField } from "./common-field.type";
import { PrimaryKey } from "./primary-key.type";
import { RelationField } from "./relation-field.type";

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
