import { AnyEntity } from "../../entity/any-entity.type";
import { BaseEntity } from "../../entity/base-entity.class";
import { PrimaryFieldPossible } from "./primary-field-possible.type";

export type PrimaryField<Entity extends AnyEntity> = Extract<
  Entity extends BaseEntity<any, infer Primary> ? Primary : never,
  PrimaryFieldPossible<Entity>
>;
