import { AnyEntity } from "../../entity/any-entity.type";
import { EntityField } from "../entity-field.type";
import { FieldAccessor } from "./field.accessor";

export class CommonFieldAccessor<
  Entity extends AnyEntity = AnyEntity,
  Field extends EntityField<Entity> = EntityField<Entity>,
> extends FieldAccessor<Entity, Field> {}
