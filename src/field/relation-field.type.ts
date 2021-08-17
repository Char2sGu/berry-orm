import { BaseEntity } from "../entity/base-entity.class";
import { ExtractKeys } from "../utils/extract-keys.type";
import { Collection } from "./collection.class";
import { EmptyValue } from "./empty-value.type";
import { EntityField } from "./entity-field.type";

export type RelationField<Entity extends BaseEntity<Entity>> = Extract<
  EntityField<Entity>,
  ExtractKeys<Entity, BaseEntity | Collection<BaseEntity> | EmptyValue>
>;
