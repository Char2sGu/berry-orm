import { BaseEntity } from "../base-entity.class";
import { Type } from "../utils";

export const Entity = () => (type: Type<BaseEntity>) => {};
