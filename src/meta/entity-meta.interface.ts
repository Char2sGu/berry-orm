import { BaseEntity } from "../base-entity.class";
import { Type } from "../utils";
import { FieldMeta } from "./field-meta.interface";

export interface EntityMeta {
  type: Type<BaseEntity>;
  fields: { items: Record<string, FieldMeta>; primary: string };
}
