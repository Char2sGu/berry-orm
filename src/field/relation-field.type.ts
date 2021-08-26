import { AnyEntity } from "../entity/any-entity.type";
import { ExtractKeys } from "../utils/extract-keys.type";
import { Collection } from "./collection.class";
import { EmptyValue } from "./empty-value.type";
import { EntityField } from "./entity-field.type";

export type RelationField<Entity extends AnyEntity> = Extract<
  EntityField<Entity>,
  ExtractKeys<Entity, AnyEntity | Collection<AnyEntity> | EmptyValue>
>;
