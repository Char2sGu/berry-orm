/* eslint-disable */

import { Scalar } from "./scalar.type";
import { SerializerType } from "./serializer-type.interface";

export abstract class AbstractSerializer<
  Internal = unknown,
  External extends Scalar | Scalar[] = Scalar | Scalar[],
> {
  protected orm;
  constructor(...[orm]: ConstructorParameters<SerializerType>) {
    this.orm = orm;
  }
  abstract serialize(value: Internal): External;
  abstract deserialize(value: External | Internal): Internal;
}
