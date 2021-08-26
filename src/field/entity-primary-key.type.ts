import { BaseEntity } from "../entity/base-entity.class";
import { EntityPrimaryField } from "./entity-primary-field.type";
import { PrimaryKey } from "./primary-key.type";

export type EntityPrimaryKey<Entity extends BaseEntity> =
  Entity[EntityPrimaryField<Entity>] extends infer Primary
    ? Primary extends PrimaryKey
      ? Primary
      : never
    : never;
