import { AnyEntity } from "../../entity/any-entity.type";
import { PrimaryField } from "../field-names/primary-field.type";
import { PrimaryKeyPossible } from "./primary-key-possible.type";

export type PrimaryKey<Entity extends AnyEntity = AnyEntity> = Extract<
  Entity[PrimaryField<Entity>],
  PrimaryKeyPossible
>;
