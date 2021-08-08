import { BaseEntity } from "./base-entity.class";
import { PrimaryKeyField } from "./primary-key-field.type";

export type EntityStore<T extends BaseEntity<T>> = Map<
  T[T extends BaseEntity<infer _, infer Primary>
    ? Primary extends PrimaryKeyField<T>
      ? Primary
      : never
    : never],
  T
>;
