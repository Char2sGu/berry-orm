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

  inspect(prototype: BaseEntity) {
    const meta = this.getMeta(prototype);
    if (!meta.fields.primary)
      throw new Error(`The entity ${meta.type.name} must have a primary key`);
    if (!meta.fields.items[meta.fields.primary])
      throw new Error(
        `The field ${meta.fields.primary} of ${meta.type.name} must be firstly registered as a field before setting it as the primary key field`,
      );
    meta.inspected = true;
    return this;
  }

  private getMeta(prototype: BaseEntity) {
    let meta = prototype[META];
    if (!meta)
      meta = prototype[META] = {
        type: prototype.constructor as Type<BaseEntity>,
        fields: { items: {}, primary: "" },
        inspected: false,
      };
    return meta;
  }
}
