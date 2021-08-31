import { EntityRelationManager } from "../entity/entity-relation-manager.class";
import { Type } from "../utils/type.interface";
import { AbstractSerializer } from "./abstract.serializer";

export interface SerializerType<Serializer extends AbstractSerializer = never>
  extends Type<Serializer> {
  new (relationManager: EntityRelationManager): Serializer;
}
