import { AnyEntity } from "../entity/any-entity.type";
import { EntityField } from "../field/entity-field.type";
import { META } from "../symbols";
import { EntityMetaField } from "./entity-meta-field.class";
import { EntityMeta } from "./entity-meta.class";
import { EntityMetaError } from "./entity-meta.error";

export const Field =
  () =>
  <Entity extends AnyEntity>(
    prototype: Entity,
    field: EntityField<Entity>,
  ): void => {
    const meta = (prototype[META] =
      prototype[META] ?? new EntityMeta(prototype));

    const fieldMeta = new EntityMetaField(field);

    if (meta.fields[field])
      throw new EntityMetaError({
        type: meta.type,
        field: field,
        message: "The field cannot be registered for more than once",
      });

    meta.fields[field] = fieldMeta;
  };
