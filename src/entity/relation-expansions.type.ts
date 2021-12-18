import { RelationField } from "../field/field-types/relation-field.type";
import { AnyEntity } from "./any-entity.type";
import { EntityOfRelation } from "./entity-of-relation.type";

export type RelationExpansions<Entity extends AnyEntity> = {
  [Field in RelationField<Entity>]?:
    | RelationExpansions<EntityOfRelation<Entity[Field]>>
    | boolean;
};
