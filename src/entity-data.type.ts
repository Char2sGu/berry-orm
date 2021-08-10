import { BaseEntity } from "./base-entity.class";
import { EntityField } from "./entity-field.type";
import { PrimaryKey } from "./primary-key.type";

// TODO: stricter type
export type EntityData<Entity extends BaseEntity> = Partial<
  {
    [K in EntityField<Entity>]: Entity[K] extends BaseEntity
      ? EntityData<Entity[K]> | PrimaryKey
      : Entity[K] extends BaseEntity[]
      ? EntityData<Entity[K][0]>[] | PrimaryKey[]
      : Entity[K];
  }
>;
