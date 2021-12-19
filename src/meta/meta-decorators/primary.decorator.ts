import { AnyEntity } from "../../entity/any-entity.type";
import { EntityType } from "../../entity/entity-type.interface";
import { PrimaryField } from "../../field/field-names/primary-field.type";
import { META } from "../../symbols";
import { EntityMetaError } from "../entity-meta.error";

export const Primary =
  () =>
  <Entity extends AnyEntity>(
    prototype: Entity,
    field: PrimaryField<Entity>,
  ): void => {
    const meta = prototype[META];
    if (!meta?.fields[field])
      throw new EntityMetaError({
        type: prototype.constructor as EntityType<Entity>,
        field,
        message: "@Field() must be applied before @Primary()",
      });
    meta.primary = field;
  };
