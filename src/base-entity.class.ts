import { EntityMeta } from "./entity-meta.interface";
import { PrimaryKeyField } from "./primary-key-field.type";
import { DATA, META, POPULATED } from "./symbols";

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
  [POPULATED]: boolean;
  /**
   * Stores the actual value of each field, which is also the data source of
   * the accesssors defined on the fields.
   */
  [DATA]: Record<string, unknown>;
}
