import { AnyEntity } from "../entity/any-entity.type";
import { EntityPrimaryField } from "./entity-primary-field.type";
import { PrimaryKey } from "./primary-key.type";

export type EntityPrimaryKey<Entity extends AnyEntity> =
  Entity[EntityPrimaryField<Entity>] extends infer Primary
    ? Primary extends PrimaryKey
      ? Primary
      : never
    : never;
