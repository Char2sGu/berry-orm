import { BaseEntity } from "./base-entity.class";
import { META } from "./symbols";
import { Type } from "./utils/type.type";

export class EntityMetaHelper {
  addField(prototype: BaseEntity, name: string, primary = false) {
    const meta = this.getMeta(prototype);
    meta.fields.items[name] = { name };
    if (primary) meta.fields.primary = name;
    return this;
  }

  inspect(prototype: BaseEntity) {
    const meta = this.getMeta(prototype);
    if (!meta.fields.primary)
      throw new Error(`Entity ${meta.type} must have a primary key`);
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
