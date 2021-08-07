import { EntityMeta } from "./meta";
import { META, PK } from "./symbols";

export abstract class BaseEntity {
  [META]: EntityMeta;

  get [PK]() {
    const field = this[META].fields.primary;
    return this[field as keyof this] + "";
  }
}
