import { BaseEntity } from "./base-entity.class";
import { PrimaryKey } from "./primary-key.type";

export type EntityData<Entity extends BaseEntity<Entity>> = {
  [K in string & keyof Entity]: Entity[K] extends Function
    ? never
    : Entity[K] extends BaseEntity<any, any>
    ? EntityData<Entity[K]> | PrimaryKey
    : Entity[K] extends BaseEntity<any, any>[]
    ? EntityData<Entity[K][0]>[] | PrimaryKey[]
    : Entity[K];
};
