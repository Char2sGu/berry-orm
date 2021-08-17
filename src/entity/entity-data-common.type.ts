import { CommonField } from "../field/common-field.type";
import { BaseEntity } from "./base-entity.class";

export type EntityDataCommon<Entity extends BaseEntity> = Pick<
  Entity,
  CommonField<Entity>
>;
