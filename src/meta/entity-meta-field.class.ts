import { AnyEntity } from "../entity/any-entity.type";
import { EntityField } from "../field/entity-field.type";
import { EntityMetaRelation } from "./entity-meta-relation.class";

export class EntityMetaField<
  Entity extends AnyEntity = AnyEntity,
  Field extends EntityField<Entity> = EntityField<Entity>,
> {
  relation?: EntityMetaRelation;
  constructor(readonly name: Field) {}
}
