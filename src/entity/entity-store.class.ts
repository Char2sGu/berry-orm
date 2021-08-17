import { PrimaryKeyField } from "../field/primary-key-field.type";
import { BaseEntity } from "./base-entity.class";

export class EntityStore<Entity extends BaseEntity> extends Map<
  Entity[Entity extends BaseEntity<infer _, infer Primary>
    ? Primary extends PrimaryKeyField<Entity>
      ? Primary
      : never
    : never],
  Entity
> {}
