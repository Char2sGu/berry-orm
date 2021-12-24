import { ExtractKeys } from "../../common/extract-keys.type";
import { AnyEntity } from "../../entity/any-entity.type";
import { EmptyValue } from "../field-values/empty-value.type";
import { EntityFieldBase } from "./entity-field-base.type";

export type RelationFieldToOne<Entity extends AnyEntity<Entity>> = Extract<
  EntityFieldBase<Entity>,
  ExtractKeys<Entity, AnyEntity | EmptyValue>
>;
