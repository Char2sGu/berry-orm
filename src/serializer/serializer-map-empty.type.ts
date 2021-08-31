import { AnyEntity } from "../entity/any-entity.type";
import { SerializerMap } from "./serializer-map.type";

export type SerializerMapEmpty<Entity extends AnyEntity> = Partial<
  Record<keyof SerializerMap<Entity>, undefined>
>;
