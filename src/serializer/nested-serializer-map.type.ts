import { AnyEntity } from "../entity/any-entity.type";
import { EntityOfRelation } from "../entity/entity-of-relation.type";
import { RelationField } from "../field/relation-field.type";
import { SerializerMap } from "./serializer-map.type";

export type NestedSerializerMap<Entity extends AnyEntity> =
  SerializerMap<Entity> &
    {
      [Field in RelationField<Entity>]?: NestedSerializerMap<
        EntityOfRelation<Entity[Field]>
      >;
    };
