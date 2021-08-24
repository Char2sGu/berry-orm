import { AnyEntity } from "..";
import { BaseEntity } from "../entity/base-entity.class";
import { CommonFieldAccessor } from "./common.field-accessor";
import { PrimaryField } from "./primary-field.type";

export class PrimaryFieldAccessor<
  Entity extends BaseEntity<Entity, Field> = AnyEntity,
  Field extends PrimaryField<Entity> = PrimaryField<Entity>,
> extends CommonFieldAccessor<Entity, Field> {
  handleSet(newValue: Entity[Field]): void {
    if (this.value) throw new Error("The Primary key field cannot be updated");
    this.value = newValue;
  }
}
