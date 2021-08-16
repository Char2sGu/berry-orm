import { BerryOrm } from "./berry-orm.class";
import { Collection } from "./collection.class";
import { EntityField } from "./entity-field.type";
import { EntityMeta } from "./entity-meta.interface";
import { PrimaryKeyField } from "./primary-key-field.type";
import { META, POPULATED } from "./symbols";

/**
 * The base class of every entities.
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
   * the this has been populated.
   */
  [POPULATED] = false;

  constructor(private orm: BerryOrm, primaryKey: Entity[Primary]) {
    Object.keys(this[META].fields.items).forEach((field) =>
      this.initField(field as EntityField<Entity>),
    );
    const entity = this as unknown as Entity;
    entity[this[META].fields.primary] = primaryKey;
  }

  /**
   * Define accessors on the specified field of the this to prevent
   * unexpected bugs and instantiate {@link Collection}s.
   * @param this
   * @param field
   */
  private initField(field: EntityField<Entity>) {
    const entity = this as unknown as Entity;

    const isPrimaryKeyField = entity[META].fields.primary == field;
    const isCollectionField =
      !!entity[META].fields.items[field].relation?.multi;

    let fieldValue: unknown;
    Reflect.defineProperty(entity, field, {
      get: () => fieldValue,
      set: (value: unknown) => {
        if (isPrimaryKeyField && fieldValue)
          throw new Error("The Primary key cannot be updated");
        if (isCollectionField && fieldValue)
          throw new Error("Collection fields cannot be set");
        fieldValue = value;
      },
    });

    if (isCollectionField)
      entity[field] = new Collection(entity.orm, entity) as any;
  }
}
