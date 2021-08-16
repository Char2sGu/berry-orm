import { BaseEntity } from "./base-entity.class";
import { PrimaryKeyField } from "./primary-key-field.type";

export class EntityStore<Entity extends BaseEntity> extends Map<
  Entity[Entity extends BaseEntity<infer _, infer Primary>
    ? Primary extends PrimaryKeyField<Entity>
      ? Primary
      : never
    : never],
  Entity
> {}
