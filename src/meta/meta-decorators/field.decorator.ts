import { AnyEntity } from "../../entity/any-entity.type";
import { EntityType } from "../../entity/entity-type.interface";
import { EntityField } from "../../field/field-names/entity-field.type";
import { META } from "../../symbols";
import { EntityMetaError } from "../entity-meta.error";
import { EntityFieldMeta } from "../meta-objects/entity-field-meta.class";
import { EntityMeta } from "../meta-objects/entity-meta.class";

export const Field =
  () =>
  <Entity extends AnyEntity>(
    prototype: Entity,
    field: EntityField<Entity>,
  ): void => {
    const meta = (prototype[META] =
      prototype[META] ??
      new EntityMeta(prototype.constructor as EntityType<Entity>));

    const fieldMeta = new EntityFieldMeta(field);

    if (meta.fields[field])
      throw new EntityMetaError({
        type: meta.type,
        field: field,
        message: "@Field() can be applied for only once on each field",
      });

    meta.fields[field] = fieldMeta;
  };
