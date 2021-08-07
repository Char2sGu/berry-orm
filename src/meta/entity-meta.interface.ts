import { BaseEntity } from "../base-entity.class";
import { Type } from "../utils";
import { EntityFieldMeta } from "./entity-field-meta.interface";

export interface EntityMeta {
  type: Type<BaseEntity>;
  fields: { items: Record<string, EntityFieldMeta>; primary: string };
  inspected: boolean;
}
