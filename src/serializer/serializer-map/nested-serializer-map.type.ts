import { AnyEntity } from "../../entity/any-entity.type";
import { EntityFromRelationFieldValue } from "../../entity/entity-from-relation-field-value.type";
import { RelationField } from "../../field/field-names/relation-field.type";
import { SerializerMap } from "./serializer-map.type";

export type NestedSerializerMap<Entity extends AnyEntity<Entity>> =
  SerializerMap<Entity> &
    {
      [Field in RelationField<Entity>]?: NestedSerializerMap<
        EntityFromRelationFieldValue<Entity[Field]>
      >;
    };
