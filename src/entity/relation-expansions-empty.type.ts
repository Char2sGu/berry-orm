import { AnyEntity } from "./any-entity.type";
import { RelationExpansions } from "./relation-expansions.type";

export type RelationExpansionsEmpty<Entity extends AnyEntity> = Partial<
  Record<keyof RelationExpansions<Entity>, undefined>
>;
