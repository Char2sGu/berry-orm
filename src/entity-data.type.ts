import { BaseEntity } from "./base-entity.class";

export type EntityData<T extends BaseEntity> = {
  [K in Exclude<string & keyof T, `_${string}`>]: T[K] extends Function
    ? never
    : T[K];
};
