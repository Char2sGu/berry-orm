import { FieldMeta } from "./field-meta.interface";

export interface FieldOptions {
  primary?: boolean;
  relation?: FieldMeta["relation"];
}
