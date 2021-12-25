import { AnyEntity } from "../../entity/any-entity.type";
import { PrimaryField } from "../field-names/primary-field.type";
import { PrimaryKey } from "../field-values/primary-key.type";
import { BaseFieldAccessor } from "./base-field.accessor";
import { FieldAccessDeniedError } from "./field-access-denied.error";

export class PrimaryFieldAccessor<
  Entity extends AnyEntity,
> extends BaseFieldAccessor<Entity, PrimaryField<Entity>> {
  handleSet(newValue: PrimaryKey<Entity>): void {
    if (this.value)
      throw new FieldAccessDeniedError(
        this.entity,
        this.field,
        "readonly",
        "Primary key fields are readonly",
      );
    super.handleSet(newValue);
  }
}
