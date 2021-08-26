import { AnyEntity } from "..";
import { BaseEntity } from "../entity/base-entity.class";
import { EntityType } from "../entity/entity-type.type";
import { EntityField } from "../field/entity-field.type";
import { PrimaryField } from "../field/primary-field.type";
import { IdentityMap } from "../identity-map.class";
import { FieldMeta } from "./field-meta.interface";

export interface EntityMeta<
  Entity extends BaseEntity = AnyEntity,
  Primary extends PrimaryField<Entity> = PrimaryField<Entity>,
> {
  type: EntityType<Entity>;
  fields: {
    items: Record<EntityField<Entity>, FieldMeta<Entity>>;
    primary: Primary;
  };
  map: () => IdentityMap<Entity>;
}
