import { PrimaryField } from "../field/primary-field.type";
import { BaseEntity } from "./base-entity.class";

export class IdentityMap<Entity extends BaseEntity> extends Map<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Entity[Entity extends BaseEntity<any, infer Primary>
    ? Primary extends PrimaryField<Entity>
      ? Primary
      : never
    : never],
  Entity
> {}
