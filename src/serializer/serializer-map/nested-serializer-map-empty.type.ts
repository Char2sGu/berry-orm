import { AnyEntity } from "../../entity/any-entity.type";
import { NestedSerializerMap } from "./nested-serializer-map.type";

export type NestedSerializerMapEmpty<Entity extends AnyEntity> = Partial<
  Record<keyof NestedSerializerMap<Entity>, undefined>
>;
