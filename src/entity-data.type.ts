import { BaseEntity } from "./base-entity.class";

export type EntityData<T extends BaseEntity> = {
  [K in string & keyof T]: T[K] extends Function ? never : T[K];
};
