import { AnyEntity } from "../..";
import { RelationFieldToMany } from "./relation-field-to-many.type";
import { RelationFieldToOne } from "./relation-field-to-one.type";

export type RelationField<Entity extends AnyEntity> =
  | RelationFieldToOne<Entity>
  | RelationFieldToMany<Entity>;
