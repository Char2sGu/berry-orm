import { EntityMeta } from "./meta";
import { META } from "./symbols";

export abstract class BaseEntity {
  [META]: EntityMeta;

  get _pk() {
    const field = this[META].fields.primary;
    return this[field as keyof this] + "";
  }
}
