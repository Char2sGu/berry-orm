import { EntityRelationManager } from "../entity/entity-relation-manager.class";
import { Type } from "../utils/type.type";
import { AbstractSerializer } from "./abstract.serializer";

export type SerializerType<Serializer extends AbstractSerializer = never> =
  Type<Serializer, [relationManager: EntityRelationManager]>;
