import { BaseEntity } from "../base-entity.class";
import { container } from "../container";
import { Type } from "../utils";
import { EntityMetaHelper } from "./entity-meta-helper.class";

export const Entity = () => (type: Type<BaseEntity>) => {
  container.get(EntityMetaHelper).inspect(type.prototype);
};
