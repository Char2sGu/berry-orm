import { BaseEntity, PrimaryKeyField } from ".";

export type EntityStore<Entity extends BaseEntity> = Map<
  Entity[Entity extends BaseEntity<infer _, infer Primary>
    ? Primary extends PrimaryKeyField<Entity>
      ? Primary
      : never
    : never],
  Entity
>;
