import { AnyEntity } from "../..";
import { ExtractKeys } from "../../utils/extract-keys.type";
import { Collection } from "../field-values/collection.class";
import { EntityFieldBase } from "./entity-field-base.type";

export type RelationFieldToMany<Entity extends AnyEntity<Entity>> = Extract<
  EntityFieldBase<Entity>,
  ExtractKeys<Entity, Collection<AnyEntity>>
>;
