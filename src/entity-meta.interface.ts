import { AnyEntity } from ".";
import { BaseEntity } from "./base-entity.class";
import { EntityField } from "./entity-field.type";
import { EntityType } from "./entity-type.type";
import { FieldMeta } from "./field-meta.interface";
import { PrimaryKeyField } from "./primary-key-field.type";

export interface EntityMeta<
  Entity extends BaseEntity = AnyEntity,
  Primary extends PrimaryKeyField<Entity> = PrimaryKeyField<Entity>,
> {
  type: EntityType<Entity>;
  fields: {
    items: Record<EntityField<Entity>, FieldMeta<Entity>>;
    primary: Primary;
  };
}