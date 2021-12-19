import { AnyEntity } from "../../entity/any-entity.type";
import { PrimaryField } from "../field-names/primary-field.type";
import { PrimaryKey } from "../field-values/primary-key.type";
import { BaseFieldAccessor } from "./base-field.accessor";

export class PrimaryFieldAccessor<
  Entity extends AnyEntity<Entity>,
> extends BaseFieldAccessor<Entity, PrimaryField<Entity>> {
  handleSet(newValue: PrimaryKey<Entity>): void {
    if (this.value) throw new Error("The Primary key field cannot be updated");
    this.value = newValue;
  }
}
