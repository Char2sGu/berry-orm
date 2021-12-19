import { AnyEntity } from "../..";
import { ExcludeKeys } from "../../utils/exclude-keys.type";

export type EntityFieldBase<Entity extends AnyEntity> = Extract<
  // eslint-disable-next-line @typescript-eslint/ban-types
  ExcludeKeys<Entity, Function>,
  string
>;
