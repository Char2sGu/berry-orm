import { AnyEntity } from "../../entity/any-entity.type";
import { EntityRepresentation } from "../../entity/entity-representation.type";
import { RelationField } from "../field-names/relation-field.type";
import { Collection } from "../field-values/collection.class";
import { EmptyValue } from "../field-values/empty-value.type";

export type RelationFieldData<
  Entity extends AnyEntity<Entity> = AnyEntity,
  Field extends RelationField<Entity> = RelationField<Entity>,
> = Entity[Field] extends AnyEntity
  ? EntityRepresentation<Entity[Field]> | EmptyValue
  : Entity[Field] extends Collection<infer E>
  ? E extends AnyEntity<E>
    ? EntityRepresentation<E>[]
    : never
  : never;
