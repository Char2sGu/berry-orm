import { MatchedKeys } from "../../common/matched-keys.type";
import { AnyEntity } from "../../entity/any-entity.type";
import { Collection } from "../field-values/collection.class";
import { EntityFieldBase } from "./entity-field-base.type";

export type RelationFieldToMany<Entity extends AnyEntity> = Extract<
  EntityFieldBase<Entity>,
  MatchedKeys<Entity, Collection<AnyEntity>>
>;
