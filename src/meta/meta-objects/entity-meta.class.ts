import { AnyEntity } from "../../entity/any-entity.type";
import { EntityType } from "../../entity/entity-type.interface";
import { EntityField } from "../../field/field-names/entity-field.type";
import { PrimaryField } from "../../field/field-names/primary-field.type";
import { PrimaryFieldPossible } from "../../field/field-names/primary-field-possible.type";
import { EntityFieldMeta } from "./entity-field-meta.class";

/**
 * The type parameter `Primary` is a must here, which is used to make the type
 * inference of the primary field work.
 */
export class EntityMeta<
  Entity extends AnyEntity<Entity> = AnyEntity,
  Primary extends PrimaryFieldPossible<Entity> = PrimaryField<Entity>,
> {
  primary!: Primary;
  fields = {} as Record<EntityField<Entity>, EntityFieldMeta<Entity>>;
  completed = false;

  constructor(readonly type: EntityType<Entity>) {}
}
