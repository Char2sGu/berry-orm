import { AnyEntity } from "..";
import { BaseEntity } from "../entity/base-entity.class";
import { CommonFieldAccessor } from "./common.field-accessor";
import { RelationField } from "./relation-field.type";

export class RelationToOneFieldAccessor<
  Entity extends BaseEntity = AnyEntity,
  Field extends RelationField<Entity> = RelationField<Entity>,
> extends CommonFieldAccessor<Entity, Field> {
  handleSet(newValue: Entity[Field]): void {
    const currentValue = this.value;
    // end up recurse
    if (newValue == currentValue) return;

    this.value = newValue;
    if (newValue) this.em.constructRelation(this.entity, this.field, newValue);
    else this.em.destructRelation(this.entity, this.field, currentValue);
  }
}
