import { AnyEntity, Type } from ".";

export interface EntityManagerOptions {
  entities: Type<AnyEntity>[];
}
