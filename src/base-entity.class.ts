import { EntityMeta, META, POPULATED, PrimaryKeyField } from ".";

/**
 * The base class of every entities, providing type support.
 *
 * It is recommended to create an own `BaseEntity`, which extends this one and
 * is defined getters so that the metadata can be accessed more conveniently.
 */
export abstract class BaseEntity<
  Entity extends BaseEntity = any,
  Primary extends PrimaryKeyField<Entity> = any,
> {
  [META]: EntityMeta<Entity, Primary>;
  /**
   * Indicates that the **data** fields (**relation** fields not included) of
   * the entity has been populated.
   */
  [POPULATED] = false;
}
