import { AnyEntity } from "..";
import { EntityType } from "../entity/entity-type.type";
import { EntityField } from "../field/entity-field.type";
import { PrimaryField } from "../field/primary-field.type";
import { FieldMeta } from "./field-meta.interface";

export interface EntityMeta<
  Entity extends AnyEntity = AnyEntity,
  Primary extends PrimaryField<Entity> = PrimaryField<Entity>,
> {
  type: EntityType<Entity>;
  fields: {
    items: Record<EntityField<Entity>, FieldMeta<Entity>>;
    primary: Primary;
  };
}
