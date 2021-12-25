import { SerializerMap } from "../../serializer/serializer-map/serializer-map.type";
import { SerializerMapEmpty } from "../../serializer/serializer-map/serializer-map-empty.type";
import { AnyEntity } from "../any-entity.type";
import { EntityDataCommon } from "./entity-data-common.type";
import { EntityDataRelational } from "./entity-data-relational.type";

export type EntityData<
  Entity extends AnyEntity<Entity>,
  Serializers extends SerializerMap<Entity> = SerializerMapEmpty<Entity>,
> = EntityDataCommon<Entity, Serializers> &
  Partial<EntityDataRelational<Entity>>;
