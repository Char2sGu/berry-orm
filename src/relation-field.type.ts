import { BaseEntity, EmptyValue, EntityField, ExtractKeys } from ".";

export type RelationField<Entity extends BaseEntity<Entity>> = Extract<
  EntityField<Entity>,
  ExtractKeys<Entity, BaseEntity | Set<BaseEntity> | EmptyValue>
>;
