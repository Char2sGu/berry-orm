import { BaseEntity } from "../entity/base-entity.class";
import { PrimaryField } from "./primary-field.type";

export type EntityPrimaryField<Entity extends BaseEntity> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Entity extends BaseEntity<any, infer Primary>
    ? Primary extends PrimaryField<Entity>
      ? Primary
      : never
    : never;
