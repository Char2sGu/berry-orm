import { AnyEntity } from "../../entity/any-entity.type";
import { RelationField } from "../relation-field.type";
import { BaseFieldAccessor } from "./base-field.accessor";

export class RelationFieldToManyAccessor<
  Entity extends AnyEntity = AnyEntity,
  Field extends RelationField<Entity> = RelationField<Entity>,
> extends BaseFieldAccessor<Entity, Field> {
  handleSet(newValue: Entity[Field]): void {
    if (this.value) throw new Error("Collection fields cannot be updated");
    this.value = newValue;
  }
}
