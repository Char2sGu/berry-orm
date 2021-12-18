import { AnyEntity } from "../../entity/any-entity.type";
import { CommonField } from "../field-types/common-field.type";
import { BaseFieldAccessor } from "./base-field.accessor";

export class CommonFieldAccessor<
  Entity extends AnyEntity = AnyEntity,
  Field extends CommonField<Entity> = CommonField<Entity>,
> extends BaseFieldAccessor<Entity, Field> {}
