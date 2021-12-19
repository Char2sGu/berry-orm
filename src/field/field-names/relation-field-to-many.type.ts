import { AnyEntity } from "../..";
import { ExtractKeys } from "../../utils/extract-keys.type";
import { Collection } from "../field-values/collection.class";
import { EntityField } from "./entity-field.type";

export type RelationFieldToMany<Entity extends AnyEntity> = Extract<
  EntityField<Entity>,
  ExtractKeys<Entity, Collection<AnyEntity>>
>;
