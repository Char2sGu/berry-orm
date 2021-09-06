import { AnyEntity } from "../entity/any-entity.type";
import { CommonFieldAccessor } from "./common.field-accessor";
import { RelationField } from "./relation-field.type";

export class RelationToManyFieldAccessor<
  Entity extends AnyEntity = AnyEntity,
  Field extends RelationField<Entity> = RelationField<Entity>,
> extends CommonFieldAccessor<Entity, Field> {
  handleSet(newValue: Entity[Field]): void {
    if (this.value) throw new Error("Collection fields cannot be updated");
    this.value = newValue;
  }
}
