import { PrimaryKeyField } from "../field";
import { BaseEntity } from "./base-entity.class";

export type EntityStore<Entity extends BaseEntity> = Map<
  Entity[Entity extends BaseEntity<infer _, infer Primary>
    ? Primary extends PrimaryKeyField<Entity>
      ? Primary
      : never
    : never],
  Entity
>;
