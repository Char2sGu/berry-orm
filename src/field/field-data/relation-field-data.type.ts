import { AnyEntity } from "../../entity/any-entity.type";
import { RelationField } from "../field-names/relation-field.type";
import { Collection } from "../field-values/collection.class";
import { EmptyValue } from "../field-values/empty-value.type";
import { RelationFieldValueRepresentation } from "./relation-field-value-representation.type";

export type RelationFieldData<
  Entity extends AnyEntity = AnyEntity,
  Field extends RelationField<Entity> = RelationField<Entity>,
> = Entity[Field] extends AnyEntity
  ? RelationFieldValueRepresentation<Entity[Field]> | EmptyValue
  : Entity[Field] extends Collection<infer E>
  ? E extends AnyEntity
    ? RelationFieldValueRepresentation<E>[]
    : never
  : never;
