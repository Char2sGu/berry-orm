import { BaseEntity } from "../base-entity.class";
import { container } from "../container";
import { EntityMetaHelper } from "../entity-meta-helper.class";
import { Type } from "../utils";

export const Entity = () => (type: Type<BaseEntity>) => {
  container.get(EntityMetaHelper).inspect(type.prototype);
};
