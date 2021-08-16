import {
  AnyEntity,
  BaseEntity,
  EntityField,
  FieldMeta,
  PrimaryKeyField,
  Type,
} from ".";

export interface EntityMeta<
  Entity extends BaseEntity = AnyEntity,
  Primary extends PrimaryKeyField<Entity> = PrimaryKeyField<Entity>,
> {
  type: Type<Entity>;
  fields: {
    items: Record<EntityField<Entity>, FieldMeta<Entity>>;
    primary: Primary;
  };
}
