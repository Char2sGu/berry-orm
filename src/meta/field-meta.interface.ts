import { BaseEntity } from "../base-entity.class";
import { Type } from "../utils";

export interface FieldMeta {
  name: string;
  relation?: () => Type<BaseEntity<any, any>>;
}
