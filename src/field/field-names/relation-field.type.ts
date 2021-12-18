import { AnyEntity, ExtractKeys } from "../..";
import { Collection } from "../field-values/collection.class";
import { EmptyValue } from "../field-values/empty-value.type";
import { EntityField } from "./entity-field.type";

export type RelationField<Entity extends AnyEntity> = Extract<
  EntityField<Entity>,
  ExtractKeys<Entity, AnyEntity | Collection<AnyEntity> | EmptyValue>
>;
