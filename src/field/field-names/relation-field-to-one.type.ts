import { MatchedKeys } from "../../common/matched-keys.type";
import { AnyEntity } from "../../entity/any-entity.type";
import { EmptyValue } from "../field-values/empty-value.type";
import { EntityFieldBase } from "./entity-field-base.type";

export type RelationFieldToOne<Entity extends AnyEntity> = Extract<
  EntityFieldBase<Entity>,
  MatchedKeys<Entity, AnyEntity | EmptyValue>
>;
