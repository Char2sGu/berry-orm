import { AnyEntity } from "..";
import { BaseEntity } from "../base-entity.class";
import { RelationField } from "../relation-field.type";
import { FieldAccessor } from "./field-accessor.class";

export class RelationEntityFieldAccessor<
  Entity extends BaseEntity = AnyEntity,
  Field extends RelationField<Entity> = RelationField<Entity>,
> extends FieldAccessor<Entity, Field> {}
