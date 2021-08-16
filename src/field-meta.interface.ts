import { AnyEntity } from ".";
import { BaseEntity } from "./base-entity.class";
import { EntityField } from "./entity-field.type";
import { Type } from "./utils/type.type";

export interface FieldMeta<Entity extends BaseEntity = AnyEntity> {
  name: EntityField<Entity>;
  relation: {
    target: () => Type<AnyEntity>;
    inverse: string;
    multi: boolean;
  } | null;
}
