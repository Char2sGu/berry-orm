import { AnyEntity } from "../entity/any-entity.type";
import { EntityFromRelationFieldValue } from "../entity/entity-from-relation-field-value.type";
import { RelationField } from "../field/field-names/relation-field.type";

export type EntityManagerExportExpansions<Entity extends AnyEntity> = {
  [Field in RelationField<Entity>]?:
    | EntityManagerExportExpansions<EntityFromRelationFieldValue<Entity[Field]>>
    | boolean;
};
