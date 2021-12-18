import { Collection } from "../field/field-values/collection.class";
import { AnyEntity } from "./any-entity.type";

export type EntityOfRelation<
  FieldValue extends AnyEntity | Collection<AnyEntity>,
> = FieldValue extends AnyEntity
  ? FieldValue
  : FieldValue extends Collection<infer Entity>
  ? Entity
  : never;
