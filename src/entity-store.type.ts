import { BaseEntity } from "./base-entity.class";

export type EntityStore<T extends BaseEntity<T, any>> = Map<
  T[T extends BaseEntity<infer _, infer Primary> ? Primary : never],
  T
>;
