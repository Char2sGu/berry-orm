import { CommonField } from "../field/common-field.type";
import { AnyEntity } from "./any-entity.type";

export type EntityDataCommon<Entity extends AnyEntity> = Pick<
  Entity,
  CommonField<Entity>
>;
