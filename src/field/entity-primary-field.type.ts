import { AnyEntity } from "../entity/any-entity.type";
import { PrimaryField } from "./primary-field.type";

export type EntityPrimaryField<Entity extends AnyEntity> =
  Entity extends AnyEntity<any, infer Primary>
    ? Primary extends PrimaryField<Entity>
      ? Primary
      : never
    : never;
