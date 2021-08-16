import { BaseEntity } from "./base-entity.class";
import { CommonField } from "./common-field.type";

export type EntityDataCommon<Entity extends BaseEntity> = Pick<
  Entity,
  CommonField<Entity>
>;
