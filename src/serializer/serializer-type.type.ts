import { BerryOrm } from "../berry-orm.class";
import { AbstractSerializer } from "./abstract.serializer";

export type SerializerType<Serializer extends AbstractSerializer = never> = {
  new (orm: BerryOrm): Serializer;
  prototype: Serializer;
};
