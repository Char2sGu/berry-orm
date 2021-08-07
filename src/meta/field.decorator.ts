import { BaseEntity } from "../base-entity.class";
import { container } from "../container";
import { MetaHelper } from "./meta-helper.class";

export const Field =
  (options: { primary?: boolean } = {}) =>
  (prototype: BaseEntity, name: string) => {
    container.get(MetaHelper).registerField(prototype, name, options.primary);
  };
