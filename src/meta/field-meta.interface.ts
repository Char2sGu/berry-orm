import { AnyEntity } from "../any-entity.type";
import { BaseEntity } from "../base-entity.class";
import { EntityData } from "../entity-data.type";
import { Type } from "../utils";

export interface FieldMeta<Entity extends BaseEntity<Entity> = AnyEntity> {
  name: keyof EntityData<Entity>;
  relation?: { target: () => Type<AnyEntity>; multi?: boolean };
}
