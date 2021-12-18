import { AnyEntity } from "../entity/any-entity.type";
import { EntityType } from "../entity/entity-type.type";
import { RelationField } from "../field/field-types/relation-field.type";

export class EntityMetaRelation<TargetEntity extends AnyEntity = AnyEntity> {
  constructor(
    readonly target: () => EntityType<TargetEntity>,
    readonly inverse: RelationField<TargetEntity>,
    readonly multi = false,
  ) {}
}
