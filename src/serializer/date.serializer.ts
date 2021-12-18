import { AbstractSerializer } from "./abstract.serializer";

export class DateSerializer extends AbstractSerializer<Date, string> {
  serialize(value: Date): string {
    return value.toISOString();
  }
  deserialize(value: string | Date): Date {
    return new Date(value);
  }
}
