import { BaseEntity } from "../entity";
import { ExtractKeys } from "../utils";
import { EmptyValue } from "./empty-value.type";
import { EntityField } from "./entity-field.type";

export type RelationField<Entity extends BaseEntity<Entity>> = Extract<
  EntityField<Entity>,
  ExtractKeys<Entity, BaseEntity | BaseEntity[] | EmptyValue>
>;
