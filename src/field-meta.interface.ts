import { AnyEntity, BaseEntity, EntityField, Type } from ".";

export interface FieldMeta<Entity extends BaseEntity = AnyEntity> {
  name: EntityField<Entity>;
  relation: {
    target: () => Type<AnyEntity>;
    inverse: string;
    multi: boolean;
  } | null;
}
