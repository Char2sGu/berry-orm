import { BaseEntity } from "./base-entity.class";
import { Type } from "./utils";

export interface EntityManagerOptions {
  entities: Type<BaseEntity>[];
}
