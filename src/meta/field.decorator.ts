import { BaseEntity } from "../base-entity.class";
import { container } from "../container";
import { FieldOptions } from "./field-options.interface";
import { MetaHelper } from "./meta-helper.class";

export const Field =
  (options: FieldOptions = {}) =>
  (prototype: BaseEntity, name: string) => {
    container.get(MetaHelper).registerField(prototype, name, options.primary);
  };
