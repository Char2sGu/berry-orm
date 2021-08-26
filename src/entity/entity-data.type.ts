import { AnyEntity } from "./any-entity.type";
import { EntityDataCommon } from "./entity-data-common.type";
import { EntityDataRelation } from "./entity-data-relation.type";

export type EntityData<Entity extends AnyEntity> = EntityDataCommon<Entity> &
  Partial<EntityDataRelation<Entity>>;
