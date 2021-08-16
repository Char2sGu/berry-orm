import { BaseEntity } from "./base-entity.class";
import { EntityMeta } from "./entity-meta.interface";
import { EntityType } from "./entity-type.type";
import { PrimaryKeyField } from "./primary-key-field.type";
import { META } from "./symbols";

export const Entity =
  () =>
  <
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryKeyField<Entity>,
  >(
    type: EntityType<Entity>,
  ) => {
    const meta = (type.prototype[META] =
      type.prototype[META] ?? ({} as EntityMeta<Entity, Primary>));
    meta.type = type;
  };
