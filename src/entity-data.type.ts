import { BaseEntity } from "./base-entity.class";
import { PrimaryKey } from "./primary-key.type";

export type EntityData<T extends BaseEntity<T, any>> = {
  [K in string & keyof T]: T[K] extends Function
    ? never
    : T[K] extends BaseEntity<any, any>
    ? PrimaryKey
    : T[K] extends BaseEntity<any, any>[]
    ? PrimaryKey[]
    : T[K];
};
