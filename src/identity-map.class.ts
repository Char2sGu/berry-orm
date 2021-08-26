import { BaseEntity } from "./entity/base-entity.class";
import { PrimaryField } from "./field/primary-field.type";

export class IdentityMap<Entity extends BaseEntity> extends Map<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Entity[Entity extends BaseEntity<any, infer Primary>
    ? Primary extends PrimaryField<Entity>
      ? Primary
      : never
    : never],
  Entity
> {}
