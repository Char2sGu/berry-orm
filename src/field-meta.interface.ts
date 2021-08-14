import { AnyEntity, Type } from ".";

export interface FieldMeta {
  name: string;
  relation?: {
    target: () => Type<AnyEntity>;
    inverse: string;
    multi?: boolean;
  };
}
