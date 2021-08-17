import { AnyEntity } from "..";
import { Type } from "../utils/type.type";
import { BaseEntity } from "./base-entity.class";

export type EntityType<Entity extends BaseEntity = AnyEntity> = Type<
  Entity,
  ConstructorParameters<typeof BaseEntity>
>;
