import { PrimaryField } from "../field/primary-field.type";
import { BaseEntity } from "./base-entity.class";

export class IdentityMap<Entity extends BaseEntity> extends Map<
  // Should be fixed by setting "argsIgnorePattern" but it's not?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Entity[Entity extends BaseEntity<infer _, infer Primary>
    ? Primary extends PrimaryField<Entity>
      ? Primary
      : never
    : never],
  Entity
> {}
