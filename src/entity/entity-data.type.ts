import { SerializerMap } from "../serializer/serializer-map.type";
import { SerializerMapEmpty } from "../serializer/serializer-map-empty.type";
import { AnyEntity } from "./any-entity.type";
import { EntityDataCommon } from "./entity-data-common.type";
import { EntityDataRelation } from "./entity-data-relation.type";

export type EntityData<
  Entity extends AnyEntity,
  Serializers extends SerializerMap<Entity> = SerializerMapEmpty<Entity>,
> = EntityDataCommon<Entity, Serializers> & Partial<EntityDataRelation<Entity>>;
