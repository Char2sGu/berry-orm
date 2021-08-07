import { BaseEntity } from "../base-entity.class";
import { PrimaryKeyField } from "../primary-key-field.type";
import { FIELDS, PRIMARY, TYPE } from "../symbols";
import { Type } from "../utils";

export const Entity =
  () =>
  <T extends BaseEntity<T, Primary>, Primary extends PrimaryKeyField<T>>(
    type: Type<T>,
  ) => {
    type.prototype[TYPE] = type;
    type.prototype[FIELDS] = type.prototype[FIELDS] ?? {};
    if (!type.prototype[PRIMARY])
      throw new Error(`The entity ${type.name} must have a primary key field`);
  };
