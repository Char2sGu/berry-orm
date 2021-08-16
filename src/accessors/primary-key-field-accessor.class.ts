import { AnyEntity } from "..";
import { BaseEntity } from "../base-entity.class";
import { PrimaryKeyField } from "../primary-key-field.type";
import { FieldAccessor } from "./field-accessor.class";

export class PrimaryKeyFieldAccessor<
  Entity extends BaseEntity = AnyEntity,
  Field extends PrimaryKeyField<Entity> = PrimaryKeyField<Entity>,
> extends FieldAccessor<Entity, Field> {
  protected handleSet(newValue: Entity[Field], currentValue: Entity[Field]) {
    if (currentValue)
      throw new Error("The Primary key field cannot be updated");
    return newValue;
  }
}
