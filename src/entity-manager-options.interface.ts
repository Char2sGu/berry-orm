import { AnyEntity } from ".";
import { EntityType } from "./entity-type.type";

export interface EntityManagerOptions {
  entities: EntityType<AnyEntity>[];
}
