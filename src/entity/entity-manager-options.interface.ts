import { Type } from "../utils";
import { AnyEntity } from "./any-entity.type";

export interface EntityManagerOptions {
  entities: Type<AnyEntity>[];
}
