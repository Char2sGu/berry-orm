import { BaseEntity, CommonField, ExtractKeys, PrimaryKey } from ".";

export type PrimaryKeyField<Entity extends BaseEntity> = Extract<
  CommonField<Entity>,
  ExtractKeys<Entity, PrimaryKey>
>;
