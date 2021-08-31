/* eslint-disable */

import { Scalar } from "./scalar.type";
import { SerializerType } from "./serializer-type.interface";

export abstract class AbstractSerializer<
  Internal = unknown,
  External extends Scalar | Scalar[] = Scalar | Scalar[],
> {
  protected relationManager;
  constructor(...[relationManager]: ConstructorParameters<SerializerType>) {
    this.relationManager = relationManager;
  }
  abstract serialize(value: Internal): External;
  abstract deserialize(value: External): Internal;
  abstract distinguish(data: Internal | External): data is Internal;
}
