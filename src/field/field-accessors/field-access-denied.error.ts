import { AnyEntity } from "../../entity/any-entity.type";
import { EntityField } from "../field-names/entity-field.type";

export class FieldAccessDeniedError<
  Entity extends AnyEntity<Entity>,
> extends Error {
  constructor(
    readonly entity: Entity,
    readonly field: EntityField<Entity>,
    readonly type: FieldAccessDeniedType,
    readonly message: string,
  ) {
    super(message);
  }
}

type FieldAccessDeniedType = "version-conflict" | "readonly";
