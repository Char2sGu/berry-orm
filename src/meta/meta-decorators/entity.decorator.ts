import { AnyEntity } from "../../entity/any-entity.type";
import { EntityType } from "../../entity/entity-type.interface";
import { META } from "../../symbols";
import { EntityMetaError } from "../entity-meta.error";
import { EntityMeta } from "../meta-objects/entity-meta.class";

export const Entity =
  () =>
  <Entity extends AnyEntity<Entity>>(type: EntityType<Entity>): void => {
    const meta = type.prototype[META] as EntityMeta<Entity> | undefined;

    if (!meta)
      throw new EntityMetaError({
        type,
        message:
          "@Field() must be applied for at least once in each entity class",
      });

    if (!meta.primary)
      throw new EntityMetaError({
        type,
        message: "Must have a primary field registered",
      });

    if (meta.completed)
      throw new EntityMetaError({
        type,
        message: "@Entity() can be applied for only once to each entity",
      });

    meta.completed = true;
  };
