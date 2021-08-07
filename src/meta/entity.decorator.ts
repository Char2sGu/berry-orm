import { BaseEntity } from "../base-entity.class";
import { container } from "../container";
import { Type } from "../utils";
import { MetaHelper } from "./meta-helper.class";

export const Entity = () => (type: Type<BaseEntity>) => {
  container.get(MetaHelper).inspect(type.prototype);
};
