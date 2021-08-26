import { AnyEntity } from "..";
import { EntityType } from "../entity/entity-type.type";
import { EntityField } from "../field/entity-field.type";

export interface FieldMeta<Entity extends AnyEntity = AnyEntity> {
  name: EntityField<Entity>;
  relation: {
    target: () => EntityType<AnyEntity>;
    inverse: string;
    multi: boolean;
  } | null;
}
