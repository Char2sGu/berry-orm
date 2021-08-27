import { AnyEntity } from "../entity/any-entity.type";
import { EntityPrimaryField } from "../field/entity-primary-field.type";
import { META } from "../symbols";
import { EntityMeta } from "./entity-meta.class";
import { EntityMetaError } from "./entity-meta.error";

export const Primary =
  () =>
  <Entity extends AnyEntity>(
    prototype: Entity,
    field: EntityPrimaryField<Entity>,
  ): void => {
    const meta = prototype[META];
    if (!meta?.fields[field])
      throw new EntityMetaError({
        type: new EntityMeta(prototype).type,
        field,
        message: "@Field() must be applied before @Primary()",
      });
    meta.primary = field;
  };
