import { AnyEntity } from "../../entity/any-entity.type";
import { EntityType } from "../../entity/entity-type.interface";
import { META } from "../../symbols";
import { EntityMetaError } from "../entity-meta.error";

export const Entity =
  () =>
  <Entity extends AnyEntity<Entity>>(type: EntityType<Entity>): void => {
    if (!type.prototype[META])
      throw new EntityMetaError({
        type,
        message:
          "@Field() must be applied for at least once in each entity class",
      });
  };
