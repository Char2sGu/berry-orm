import { AnyEntity } from "../../entity/any-entity.type";
import { RelationEntityRepresentation } from "../../entity/relation-entity-representation.type";
import { RelationField } from "../field-types/relation-field.type";
import { Collection } from "./collection.class";
import { EmptyValue } from "./empty-value.type";

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
