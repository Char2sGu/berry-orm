import { AnyEntity } from "../../entity/any-entity.type";
import { RelationFieldToMany } from "../field-names/relation-field-to-many.type";
import { BaseFieldAccessor } from "./base-field.accessor";
import { FieldAccessDeniedError } from "./field-access-denied.error";

export class RelationFieldToManyAccessor<
  Entity extends AnyEntity<Entity> = AnyEntity,
  Field extends RelationFieldToMany<Entity> = RelationFieldToMany<Entity>,
> extends BaseFieldAccessor<Entity, Field> {
  handleSet(newValue: Entity[Field]): void {
    if (this.value)
      throw new FieldAccessDeniedError(
        this.entity,
        this.field,
        "readonly",
        "Collection fields are readonly",
      );
    super.handleSet(newValue);
  }
}
