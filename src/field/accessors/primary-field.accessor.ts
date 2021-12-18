import { AnyEntity } from "../../entity/any-entity.type";
import { PrimaryField } from "../primary-field.type";
import { CommonFieldAccessor } from "./common-field.accessor";

export class PrimaryFieldAccessor<
  Entity extends AnyEntity<Entity, Field>,
  Field extends PrimaryField<Entity>,
> extends CommonFieldAccessor<Entity, Field> {
  handleSet(newValue: Entity[Field]): void {
    if (this.value) throw new Error("The Primary key field cannot be updated");
    this.value = newValue;
  }
}
