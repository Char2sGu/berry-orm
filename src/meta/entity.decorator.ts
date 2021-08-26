import { AnyEntity } from "../entity/any-entity.type";
import { EntityType } from "../entity/entity-type.type";
import { PrimaryField } from "../field/primary-field.type";
import { META } from "../symbols";
import { EntityMeta } from "./entity-meta.interface";

export const Entity =
  () =>
  <
    Entity extends AnyEntity<Entity, Primary>,
    Primary extends PrimaryField<Entity>,
  >(
    type: EntityType<Entity>,
  ): void => {
    const meta = (type.prototype[META] =
      type.prototype[META] ?? ({} as EntityMeta<Entity, Primary>));
    meta.type = type;
  };
