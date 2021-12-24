import { ExtractKeys } from "../../common/extract-keys.type";
import { AnyEntity } from "../../entity/any-entity.type";
import { Collection } from "../field-values/collection.class";
import { EntityFieldBase } from "./entity-field-base.type";

export type RelationFieldToMany<Entity extends AnyEntity<Entity>> = Extract<
  EntityFieldBase<Entity>,
  ExtractKeys<Entity, Collection<AnyEntity>>
>;
