import { AnyEntity } from "../entity/any-entity.type";
import { EntityType } from "../entity/entity-type.type";
import { PrimaryField } from "../field/primary-field.type";
import { META } from "../symbols";
import { EntityMeta } from "./entity-meta.class";

export const Entity =
  () =>
  <
    Entity extends AnyEntity<Entity, Primary>,
    Primary extends PrimaryField<Entity>,
  >(
    type: EntityType<Entity>,
  ): void => {
    type.prototype[META] =
      type.prototype[META] ?? new EntityMeta(type.prototype);
  };
