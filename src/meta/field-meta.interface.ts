import { AnyEntity } from "../entity";
import { Type } from "../utils";

export interface FieldMeta {
  name: string;
  relation?: {
    target: () => Type<AnyEntity>;
    inverse: string;
    multi?: boolean;
  };
}
