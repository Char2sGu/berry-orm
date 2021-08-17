import { AnyEntity } from "..";
import { BaseEntity } from "../entity/base-entity.class";
import { EntityType } from "../entity/entity-type.type";
import { EntityField } from "../field/entity-field.type";

export interface FieldMeta<Entity extends BaseEntity = AnyEntity> {
  name: EntityField<Entity>;
  relation: {
    target: () => EntityType<AnyEntity>;
    inverse: string;
    multi: boolean;
  } | null;
}
