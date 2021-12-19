import { AnyEntity } from "../..";
import { ExtractKeys } from "../../utils/extract-keys.type";
import { EmptyValue } from "../field-values/empty-value.type";
import { EntityFieldBase } from "./entity-field-base.type";

export type RelationFieldToOne<Entity extends AnyEntity> = Extract<
  EntityFieldBase<Entity>,
  ExtractKeys<Entity, AnyEntity | EmptyValue>
>;
