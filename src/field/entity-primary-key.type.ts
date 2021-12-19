import { AnyEntity } from "../entity/any-entity.type";
import { PrimaryField } from "./field-names/primary-field.type";
import { PrimaryKey } from "./field-values/primary-key.type";

export type EntityPrimaryKey<Entity extends AnyEntity> =
  Entity[PrimaryField<Entity>] extends infer Primary
    ? Primary extends PrimaryKey
      ? Primary
      : never
    : never;
