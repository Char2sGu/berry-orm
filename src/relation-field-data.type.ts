import { AnyEntity, BaseEntity, EntityData, PrimaryKey } from ".";

export type RelationFieldData<Entity extends BaseEntity = AnyEntity> =
  | PrimaryKey
  | EntityData<Entity>;
