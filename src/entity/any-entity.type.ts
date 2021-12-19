import { PrimaryFieldPossible } from "../field/field-names/primary-field-possible.type";
import { BaseEntity } from "./base-entity.class";

/**
 * Represent an entity extending the `BaseEntity`.
 */
export type AnyEntity<
  Entity extends AnyEntity<Entity, Primary> = any,
  Primary extends PrimaryFieldPossible<Entity> = any,
> = BaseEntity<Entity, Primary> & Record<string, any>;
