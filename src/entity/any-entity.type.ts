import { PrimaryField } from "../field/primary-field.type";
import { BaseEntity } from "./base-entity.class";

/**
 * Represent an entity extending the `BaseEntity`.
 */
export type AnyEntity<
  Entity extends AnyEntity<Entity, Primary> = any,
  Primary extends PrimaryField<Entity> = any,
> = BaseEntity<Entity, Primary> & Record<string, any>;
