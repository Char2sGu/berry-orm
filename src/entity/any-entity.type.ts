import { PrimaryField } from "../field/field-names/primary-field.type";
import { BaseEntity } from "./base-entity.class";

/**
 * Represent an entity extending the `BaseEntity`.
 */
export type AnyEntity<Entity extends AnyEntity<Entity> = any> = BaseEntity<
  Entity,
  PrimaryField<Entity>
> &
  Record<string, any>;
