import { BaseEntity } from "./base-entity.class";
import { PrimaryKeyField } from "./primary-key-field.type";

export type EntityStore<Entity extends BaseEntity<Entity>> = Map<
  Entity[Entity extends BaseEntity<infer _, infer Primary>
    ? Primary extends PrimaryKeyField<Entity>
      ? Primary
      : never
    : never],
  Entity
>;
