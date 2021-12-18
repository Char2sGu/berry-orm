import { AnyEntity } from "../entity/any-entity.type";
import { EntityType } from "../entity/entity-type.type";
import { PrimaryField } from "../field/field-types/primary-field.type";
import { META } from "../symbols";
import { EntityMetaError } from "./entity-meta.error";

export const Entity =
  () =>
  <
    Entity extends AnyEntity<Entity, Primary>,
    Primary extends PrimaryField<Entity>,
  >(
    type: EntityType<Entity>,
  ): void => {
    if (!type.prototype[META])
      throw new EntityMetaError({
        type,
        message: "Must have at least one field",
      });
  };
