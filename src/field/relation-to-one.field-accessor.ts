import { AnyEntity, BerryOrm } from "..";
import { BaseEntity } from "../entity/base-entity.class";
import { CommonFieldAccessor } from "./common.field-accessor";
import { PerformSet } from "./perform-set.interface";
import { RelationField } from "./relation-field.type";

export class RelationToOneFieldAccessor<
  Entity extends BaseEntity = AnyEntity,
  Field extends RelationField<Entity> = RelationField<Entity>,
> extends CommonFieldAccessor<Entity, Field> {
  handleSet(
    performSet: PerformSet<Entity[Field]>,
    newValue: Entity[Field],
    currentValue: Entity[Field],
    orm: BerryOrm,
    entity: Entity,
    field: Field,
  ) {
    // end up recurse
    if (newValue == currentValue) return;

    performSet(newValue);
    if (newValue) orm.constructRelation(entity, field, newValue);
    else orm.destructRelation(entity, field, currentValue);
  }
}
