import { AnyEntity } from "..";
import { BaseEntity } from "../base-entity.class";
import { RelationField } from "../relation-field.type";
import { FieldAccessor } from "./field-accessor.class";

export class CollectionFieldAccessor<
  Entity extends BaseEntity = AnyEntity,
  Field extends RelationField<Entity> = RelationField<Entity>,
> extends FieldAccessor<Entity, Field> {
  protected handleSet(newValue: Entity[Field], currentValue: Entity[Field]) {
    if (currentValue) throw new Error("Collection fields cannot be updated");
    return newValue;
  }
}
