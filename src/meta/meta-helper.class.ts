import { BaseEntity } from "../base-entity.class";
import { META } from "../symbols";
import { Type } from "../utils";
import { FieldOptions } from "./field-options.interface";

export class MetaHelper {
  registerField(prototype: BaseEntity, name: string, options: FieldOptions) {
    const meta = this.getMeta(prototype);
    meta.fields.items[name] = { name };
    if (options.primary) meta.fields.primary = name;
    return this;
  }

  private getMeta(prototype: BaseEntity) {
    let meta = prototype[META];
    if (!meta)
      meta = prototype[META] = {
        type: prototype.constructor as Type<BaseEntity>,
        fields: { items: {}, primary: "" },
      };
    return meta;
  }
}
