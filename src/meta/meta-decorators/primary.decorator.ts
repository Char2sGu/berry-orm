import { AnyEntity } from "../../entity/any-entity.type";
import { EntityType } from "../../entity/entity-type.interface";
import { PrimaryField } from "../../field/field-names/primary-field.type";
import { META } from "../../symbols";
import { EntityMetaError } from "../entity-meta.error";
import { EntityMeta } from "../meta-objects/entity-meta.class";

export const Primary =
  () =>
  <Entity extends AnyEntity>(
    prototype: Entity,
    field: PrimaryField<Entity>,
  ): void => {
    const meta = prototype[META] as EntityMeta<Entity> | undefined;
    const type = prototype.constructor as EntityType<Entity>;
    if (!meta?.fields[field])
      throw new EntityMetaError({
        type,
        field,
        message: "@Primary() must be applied after(above) @Field()",
      });
    if (meta?.primary)
      throw new EntityMetaError({
        type,
        field,
        message: "@Primary() can be applied for only once in each entity class",
      });
    meta.primary = field;
  };
