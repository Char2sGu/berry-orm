import { AnyEntity } from "./any-entity.type";
import { Type } from "./utils";

export interface EntityManagerOptions {
  entities: Type<AnyEntity>[];
}
