import { AnyEntity } from "../../entity/any-entity.type";
import { PrimaryField } from "../field-types/primary-field.type";
import { BaseFieldAccessor } from "./base-field.accessor";

export class PrimaryFieldAccessor<
  Entity extends AnyEntity<Entity, Field>,
  Field extends PrimaryField<Entity>,
> extends BaseFieldAccessor<Entity, Field> {
  handleSet(newValue: Entity[Field]): void {
    if (this.value) throw new Error("The Primary key field cannot be updated");
    this.value = newValue;
  }
}
