import { AnyEntity } from "..";
import { BaseEntity } from "../entity/base-entity.class";
import { CommonFieldAccessor } from "./common.field-accessor";
import { PerformSet } from "./perform-set.interface";
import { RelationField } from "./relation-field.type";

export class RelationToManyFieldAccessor<
  Entity extends BaseEntity = AnyEntity,
  Field extends RelationField<Entity> = RelationField<Entity>,
> extends CommonFieldAccessor<Entity, Field> {
  handleSet(
    performSet: PerformSet<Entity[Field]>,
    newValue: Entity[Field],
    currentValue: Entity[Field],
  ) {
    if (currentValue) throw new Error("Collection fields cannot be updated");
    performSet(newValue);
  }
}
