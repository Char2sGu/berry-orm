import { AnyEntity } from "..";
import { EntityType } from "../entity/entity-type.type";
import { EntityField } from "../field/entity-field.type";

export interface EntityMetaField<
  Entity extends AnyEntity = AnyEntity,
  Field extends EntityField<Entity> = EntityField<Entity>,
> {
  name: Field;
  relation: {
    target: () => EntityType<AnyEntity>;
    inverse: string;
    multi: boolean;
  } | null;
}
