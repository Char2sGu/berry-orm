import { AnyEntity } from "../../entity/any-entity.type";
import { RelationField } from "../relation-field.type";
import { CommonFieldAccessor } from "./common-field.accessor";

export class RelationFieldToManyAccessor<
  Entity extends AnyEntity = AnyEntity,
  Field extends RelationField<Entity> = RelationField<Entity>,
> extends CommonFieldAccessor<Entity, Field> {
  handleSet(newValue: Entity[Field]): void {
    if (this.value) throw new Error("Collection fields cannot be updated");
    this.value = newValue;
  }
}
