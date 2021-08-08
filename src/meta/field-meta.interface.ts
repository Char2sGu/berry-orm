import { AnyEntity } from "../any-entity.type";
import { BaseEntity } from "../base-entity.class";
import { Type } from "../utils";

export interface FieldMeta<Entity extends BaseEntity<Entity> = AnyEntity> {
  name: string & keyof Entity;
  relation?: { target: () => Type<AnyEntity>; multi?: boolean };
}
