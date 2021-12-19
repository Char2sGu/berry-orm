import { AnyEntity } from "../../entity/any-entity.type";
import { EntityField } from "../../field/field-names/entity-field.type";
import { EntityRelationMeta } from "./entity-relation-meta.class";

export class EntityFieldMeta<
  Entity extends AnyEntity<Entity> = AnyEntity,
  Field extends EntityField<Entity> = EntityField<Entity>,
> {
  relation?: EntityRelationMeta;
  constructor(readonly name: Field) {}
}
