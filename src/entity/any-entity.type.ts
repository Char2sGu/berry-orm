import { BaseEntity } from "..";
import { PrimaryField } from "../field/primary-field.type";

/**
 * Represent an entity extending the `BaseEntity`.
 */
export type AnyEntity<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Entity extends AnyEntity<Entity, Primary> = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Primary extends PrimaryField<Entity> = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = BaseEntity<Entity, Primary> & Record<string, any>;
