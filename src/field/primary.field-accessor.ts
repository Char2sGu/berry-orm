import { AnyEntity } from "..";
import { BaseEntity } from "../entity/base-entity.class";
import { CommonFieldAccessor } from "./common.field-accessor";
import { PerformSet } from "./perform-set.interface";
import { PrimaryKeyField } from "./primary-key-field.type";

export class PrimaryFieldAccessor<
  Entity extends BaseEntity = AnyEntity,
  Field extends PrimaryKeyField<Entity> = PrimaryKeyField<Entity>,
> extends CommonFieldAccessor<Entity, Field> {
  handleSet(
    performSet: PerformSet<Entity[Field]>,
    newValue: Entity[Field],
    currentValue: Entity[Field],
  ) {
    if (currentValue)
      throw new Error("The Primary key field cannot be updated");
    performSet(newValue);
  }
}
