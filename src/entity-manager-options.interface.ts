import { AnyEntity } from ".";
import { Type } from "./utils/type.type";

export interface EntityManagerOptions {
  entities: Type<AnyEntity>[];
}
