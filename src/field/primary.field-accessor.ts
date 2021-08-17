import { AnyEntity } from "..";
import { BaseEntity } from "../entity/base-entity.class";
import { CommonFieldAccessor } from "./common.field-accessor";
import { PrimaryKeyField } from "./primary-key-field.type";

export class PrimaryFieldAccessor<
  Entity extends BaseEntity = AnyEntity,
  Field extends PrimaryKeyField<Entity> = PrimaryKeyField<Entity>,
> extends CommonFieldAccessor<Entity, Field> {
  protected handleSet(newValue: Entity[Field], currentValue: Entity[Field]) {
    if (currentValue)
      throw new Error("The Primary key field cannot be updated");
    return newValue;
  }
}
