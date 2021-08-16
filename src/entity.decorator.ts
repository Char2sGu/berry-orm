import { BaseEntity, EntityMeta, META, PrimaryKeyField, Type } from ".";

export const Entity =
  () =>
  <
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryKeyField<Entity>,
  >(
    type: Type<Entity>,
  ) => {
    const meta = (type.prototype[META] =
      type.prototype[META] ?? ({} as EntityMeta<Entity, Primary>));
    meta.type = type;
  };
