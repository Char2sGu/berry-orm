import { AnyEntity } from "../entity/any-entity.type";
import { PrimaryField } from "./primary-field.type";

export type EntityPrimaryField<Entity extends AnyEntity> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Entity extends AnyEntity<any, infer Primary>
    ? Primary extends PrimaryField<Entity>
      ? Primary
      : never
    : never;
