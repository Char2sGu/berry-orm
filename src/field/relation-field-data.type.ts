import { AnyEntity } from "..";
import { RelationEntityRepresentation } from "../entity/relation-entity-representation.type";
import { Collection } from "./collection.class";
import { EmptyValue } from "./empty-value.type";
import { RelationField } from "./relation-field.type";

export type RelationFieldData<
  Entity extends AnyEntity = AnyEntity,
  Field extends RelationField<Entity> = RelationField<Entity>,
> = Entity[Field] extends AnyEntity
  ? RelationEntityRepresentation<Entity[Field]> | EmptyValue
  : Entity[Field] extends Collection<infer E>
  ? E extends AnyEntity
    ? RelationEntityRepresentation<E>[]
    : never
  : never;
