import { AnyEntity } from "..";
import { BaseEntity } from "../entity/base-entity.class";
import { EntityType } from "../entity/entity-type.type";
import { EntityField } from "../field/entity-field.type";
import { PrimaryKeyField } from "../field/primary-key-field.type";
import { FieldMeta } from "./field-meta.interface";

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
