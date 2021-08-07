import { BaseEntity } from "./base-entity.class";

export type EntityData<T extends BaseEntity<T, any>> = {
  [K in string & keyof T]: T[K] extends Function ? never : T[K];
};
