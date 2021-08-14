import { AnyEntity, BaseEntity, EntityData, PrimaryKey } from ".";

export type RelationEntityRepresentation<
  Entity extends BaseEntity = AnyEntity,
> = PrimaryKey | EntityData<Entity>;
