import { AnyEntity } from ".";
import { BaseEntity } from "./base-entity.class";
import { BaseFieldAccessor } from "./base.field-accessor";
import { RelationField } from "./relation-field.type";

export class RelationEntityFieldAccessor<
  Entity extends BaseEntity = AnyEntity,
  Field extends RelationField<Entity> = RelationField<Entity>,
> extends BaseFieldAccessor<Entity, Field> {}
