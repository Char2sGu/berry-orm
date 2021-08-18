import { PrimaryField } from "../field/primary-field.type";
import { BaseEntity } from "./base-entity.class";

export class IdentityMap<Entity extends BaseEntity> extends Map<
  Entity[Entity extends BaseEntity<infer _, infer Primary>
    ? Primary extends PrimaryField<Entity>
      ? Primary
      : never
    : never],
  Entity
> {}
