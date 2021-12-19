import { AnyEntity } from "../..";
import { ExtractKeys } from "../../utils/extract-keys.type";
import { EmptyValue } from "../field-values/empty-value.type";
import { EntityField } from "./entity-field.type";

export type RelationFieldToOne<Entity extends AnyEntity> = Extract<
  EntityField<Entity>,
  ExtractKeys<Entity, AnyEntity | EmptyValue>
>;
