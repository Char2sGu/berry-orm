import { AnyEntity } from "..";
import { BaseEntity } from "../entity/base-entity.class";
import { CommonFieldAccessor } from "./common.field-accessor";
import { RelationField } from "./relation-field.type";

export class RelationToOneFieldAccessor<
  Entity extends BaseEntity = AnyEntity,
  Field extends RelationField<Entity> = RelationField<Entity>,
> extends CommonFieldAccessor<Entity, Field> {}
