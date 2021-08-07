import { BaseEntity } from "./base-entity.class";
import { EntityFieldMeta } from "./entity-field-meta.interface";
import { Type } from "./utils";

export interface EntityMeta {
  type: Type<BaseEntity>;
  fields: { items: Record<string, EntityFieldMeta>; primary: string };
  inspected: boolean;
}
