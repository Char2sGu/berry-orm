import { AnyEntity } from ".";
import { BaseEntity } from "./base-entity.class";
import { Type } from "./utils/type.type";

export type EntityType<Entity extends BaseEntity = AnyEntity> = Type<
  Entity,
  ConstructorParameters<typeof BaseEntity>
>;
