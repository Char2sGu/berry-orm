import { BaseEntity } from "./base-entity.class";
import { EntityField } from "./entity-field.type";
import { ExtractKeys } from "./utils";

export type RelationField<Entity extends BaseEntity<Entity>> = Extract<
  EntityField<Entity>,
  ExtractKeys<Entity, BaseEntity | BaseEntity[]>
>;
