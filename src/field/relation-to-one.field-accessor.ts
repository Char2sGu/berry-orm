import { AnyEntity } from "..";
import { EntityManager } from "../entity-manager.class";
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
    em: EntityManager,
    entity: Entity,
    field: Field,
  ) {
    // end up recurse
    if (newValue == currentValue) return;

    performSet(newValue);
    if (newValue) em.constructRelation(entity, field, newValue);
    else em.destructRelation(entity, field, currentValue);
  }
}
