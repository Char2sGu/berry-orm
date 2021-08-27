import { AnyEntity } from "..";
import { EntityType } from "../entity/entity-type.type";
import { EntityField } from "../field/entity-field.type";
import { PrimaryField } from "../field/primary-field.type";
import { EntityMetaField } from "./entity-meta-field.interface";

export interface EntityMeta<
  Entity extends AnyEntity = AnyEntity,
  Primary extends PrimaryField<Entity> = PrimaryField<Entity>,
> {
  type: EntityType<Entity>;
  fields: {
    items: Record<EntityField<Entity>, EntityMetaField<Entity>>;
    primary: Primary;
  };
}
