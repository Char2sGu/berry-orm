import { BaseEntity, EmptyValue, EntityField, ExtractKeys } from ".";
import { Collection } from "./collection.class";

export type RelationField<Entity extends BaseEntity<Entity>> = Extract<
  EntityField<Entity>,
  ExtractKeys<Entity, BaseEntity | Collection<BaseEntity> | EmptyValue>
>;
