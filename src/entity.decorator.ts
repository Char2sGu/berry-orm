import { BaseEntity, FIELDS, PRIMARY, PrimaryKeyField, Type, TYPE } from ".";

export const Entity =
  () =>
  <
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryKeyField<Entity>,
  >(
    type: Type<Entity>,
  ) => {
    type.prototype[TYPE] = type;
    type.prototype[FIELDS] = type.prototype[FIELDS] ?? {};
    if (!type.prototype[PRIMARY])
      throw new Error(`The entity ${type.name} must have a primary key field`);
  };
