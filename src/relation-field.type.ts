import { BaseEntity } from "./base-entity.class";
import { Collection } from "./collection.class";
import { EmptyValue } from "./empty-value.type";
import { EntityField } from "./entity-field.type";
import { ExtractKeys } from "./utils/extract-keys.type";

export type RelationField<Entity extends BaseEntity<Entity>> = Extract<
  EntityField<Entity>,
  ExtractKeys<Entity, BaseEntity | Collection<BaseEntity> | EmptyValue>
>;
