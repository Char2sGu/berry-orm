import { AnyEntity } from ".";
import { BaseEntity } from "./base-entity.class";
import { BaseFieldAccessor } from "./base.field-accessor";
import { PrimaryKeyField } from "./primary-key-field.type";

export class PrimaryFieldAccessor<
  Entity extends BaseEntity = AnyEntity,
  Field extends PrimaryKeyField<Entity> = PrimaryKeyField<Entity>,
> extends BaseFieldAccessor<Entity, Field> {
  protected handleSet(newValue: Entity[Field], currentValue: Entity[Field]) {
    if (currentValue)
      throw new Error("The Primary key field cannot be updated");
    return newValue;
  }
}
