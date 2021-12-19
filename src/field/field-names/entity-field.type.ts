import { AnyEntity } from "../../entity/any-entity.type";
import { CommonField } from "./common-field.type";
import { PrimaryField } from "./primary-field.type";
import { RelationField } from "./relation-field.type";

export type EntityField<Entity extends AnyEntity<Entity>> =
  | PrimaryField<Entity>
  | CommonField<Entity>
  | RelationField<Entity>;
