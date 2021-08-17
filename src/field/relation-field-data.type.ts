import { AnyEntity } from "..";
import { BaseEntity } from "../entity/base-entity.class";
import { RelationEntityRepresentation } from "../entity/relation-entity-representation.type";
import { Collection } from "./collection.class";
import { EmptyValue } from "./empty-value.type";
import { RelationField } from "./relation-field.type";

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
