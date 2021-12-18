import { AnyEntity } from "../../entity/any-entity.type";
import { RelationField } from "../relation-field.type";
import { BaseFieldAccessor } from "./base-field.accessor";

export class RelationFieldToOneAccessor<
  Entity extends AnyEntity,
  Field extends RelationField<Entity>,
> extends BaseFieldAccessor<Entity, Field> {
  handleSet(newValue: Entity[Field]): void {
    const currentValue = this.value;
    // end up recurse
    if (newValue == currentValue) return;

    this.value = newValue;
    if (newValue)
      this.orm.erm.constructRelation(this.entity, this.field, newValue);
    else this.orm.erm.destructRelation(this.entity, this.field, currentValue);
  }
}
