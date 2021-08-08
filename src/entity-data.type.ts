import { BaseEntity } from "./base-entity.class";
import { EntityField } from "./entity-field.type";
import { PrimaryKey } from "./primary-key.type";

export type EntityData<Entity extends BaseEntity<Entity>> = {
  [K in EntityField<Entity>]: Entity[K] extends BaseEntity<any, any>
    ? EntityData<Entity[K]> | PrimaryKey
    : Entity[K] extends BaseEntity<any, any>[]
    ? EntityData<Entity[K][0]>[] | PrimaryKey[]
    : Entity[K];
};
