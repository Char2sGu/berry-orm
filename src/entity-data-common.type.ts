import { BaseEntity, CommonField } from ".";

export type EntityDataCommon<Entity extends BaseEntity> = Pick<
  Entity,
  CommonField<Entity>
>;
