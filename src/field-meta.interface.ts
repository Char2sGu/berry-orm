import { AnyEntity } from ".";
import { BaseEntity } from "./base-entity.class";
import { EntityField } from "./entity-field.type";
import { EntityType } from "./entity-type.type";

export interface FieldMeta<Entity extends BaseEntity = AnyEntity> {
  name: EntityField<Entity>;
  relation: {
    target: () => EntityType<AnyEntity>;
    inverse: string;
    multi: boolean;
  } | null;
}
