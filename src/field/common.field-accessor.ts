import { AnyEntity } from "../entity/any-entity.type";
import { BaseEntity } from "../entity/base-entity.class";
import { BaseFieldAccessor } from "./base.field-accessor";
import { EntityField } from "./entity-field.type";

export class CommonFieldAccessor<
  Entity extends BaseEntity = AnyEntity,
  Field extends EntityField<Entity> = EntityField<Entity>,
> extends BaseFieldAccessor<Entity, Field> {}
