import { AnyEntity } from "../../entity/any-entity.type";
import { PrimaryFieldPossible } from "./primary-field-possible.type";

export type PrimaryField<Entity extends AnyEntity> = Extract<
  PrimaryFieldPossible<Entity>,
  Entity extends AnyEntity<any, infer Primary> ? Primary : never
>;
