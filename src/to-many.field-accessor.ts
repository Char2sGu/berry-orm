import { AnyEntity } from ".";
import { BaseEntity } from "./base-entity.class";
import { BaseFieldAccessor } from "./base.field-accessor";
import { RelationField } from "./relation-field.type";

export class ToManyFieldAccessor<
  Entity extends BaseEntity = AnyEntity,
  Field extends RelationField<Entity> = RelationField<Entity>,
> extends BaseFieldAccessor<Entity, Field> {
  protected handleSet(newValue: Entity[Field], currentValue: Entity[Field]) {
    if (currentValue) throw new Error("Collection fields cannot be updated");
    return newValue;
  }
}
