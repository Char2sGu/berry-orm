import { PrimaryKey } from "./primary-key.type";

export type PrimaryKeyField<T> = {
  [K in string & keyof T]: T[K] extends PrimaryKey ? K : never;
}[string & keyof T];
