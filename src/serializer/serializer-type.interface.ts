import { BerryOrm } from "../berry-orm.class";
import { AbstractSerializer } from "./abstract.serializer";

export interface SerializerType<Serializer extends AbstractSerializer = never> {
  new (orm: BerryOrm): Serializer;
  prototype: Serializer;
}
