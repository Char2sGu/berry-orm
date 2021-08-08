import { AnyEntity } from "../any-entity.type";
import { Type } from "../utils";

export interface FieldMeta {
  name: string;
  relation?: { target: () => Type<AnyEntity>; multi?: boolean };
}
