import { RelationField } from "../field/field-names/relation-field.type";
import { AnyEntity } from "./any-entity.type";
import { EntityFromRelationFieldValue } from "./entity-from-relation-field-value.type";

export type EntityManagerExportExpansions<Entity extends AnyEntity> = {
  [Field in RelationField<Entity>]?:
    | EntityManagerExportExpansions<EntityFromRelationFieldValue<Entity[Field]>>
    | boolean;
};
