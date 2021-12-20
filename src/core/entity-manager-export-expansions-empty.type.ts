import { AnyEntity } from "../entity/any-entity.type";
import { EntityManagerExportExpansions } from "./entity-manager-export-expansions.type";

export type EntityManagerExportExpansionsEmpty<
  Entity extends AnyEntity<Entity>,
> = Partial<Record<keyof EntityManagerExportExpansions<Entity>, undefined>>;
