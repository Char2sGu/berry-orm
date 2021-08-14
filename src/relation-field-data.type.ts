import {
  AnyEntity,
  BaseEntity,
  Collection,
  EmptyValue,
  RelationEntityRepresentation,
  RelationField,
} from ".";

export type RelationFieldData<
  Entity extends BaseEntity = AnyEntity,
  Field extends RelationField<Entity> = RelationField<Entity>,
> = Entity[Field] extends BaseEntity
  ? RelationEntityRepresentation<Entity[Field]> | EmptyValue
  : Entity[Field] extends Collection<infer E>
  ? E extends BaseEntity
    ? RelationEntityRepresentation<E>[]
    : never
  : never;
