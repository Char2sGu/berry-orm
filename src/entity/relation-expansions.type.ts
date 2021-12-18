import { RelationField } from "../field/field-names/relation-field.type";
import { AnyEntity } from "./any-entity.type";
import { EntityFromRelationFieldValue } from "./entity-from-relation-field-value.type";

export type RelationExpansions<Entity extends AnyEntity> = {
  [Field in RelationField<Entity>]?:
    | RelationExpansions<EntityFromRelationFieldValue<Entity[Field]>>
    | boolean;
};
