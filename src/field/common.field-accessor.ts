import { AnyEntity } from "../entity/any-entity.type";
import { BaseFieldAccessor } from "./base.field-accessor";
import { EntityField } from "./entity-field.type";

export class CommonFieldAccessor<
  Entity extends AnyEntity = AnyEntity,
  Field extends EntityField<Entity> = EntityField<Entity>,
> extends BaseFieldAccessor<Entity, Field> {}
