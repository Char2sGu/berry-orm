import { BaseEntity } from "../entity/base-entity.class";
import { EntityType } from "../entity/entity-type.type";
import { PrimaryField } from "../field/primary-field.type";
import { META } from "../symbols";
import { EntityMeta } from "./entity-meta.interface";

export const Entity =
  () =>
  <
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryField<Entity>,
  >(
    type: EntityType<Entity>,
  ) => {
    const meta = (type.prototype[META] =
      type.prototype[META] ?? ({} as EntityMeta<Entity, Primary>));
    meta.type = type;
  };
