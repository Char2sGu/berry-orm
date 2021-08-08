import { BaseEntity } from "./base-entity.class";
import { EntityField } from "./entity-field.type";
import { PrimaryKey } from "./primary-key.type";

export type PrimaryKeyField<Entity extends BaseEntity<Entity>> = {
  [K in EntityField<Entity>]: Entity[K] extends PrimaryKey ? K : never;
}[EntityField<Entity>];
