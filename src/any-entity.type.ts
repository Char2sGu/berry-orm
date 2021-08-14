import { BaseEntity } from ".";

/**
 * Represent an entity extending the `BaseEntity`.
 *
 * Usually this is done using a generic type, but this type will come to handy
 * in a few cases where generic types are not available.
 */
export type AnyEntity = BaseEntity & Record<string, any>;
