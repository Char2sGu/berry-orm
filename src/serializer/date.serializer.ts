import { AbstractSerializer } from "./abstract.serializer";

export class DateSerializer extends AbstractSerializer<Date, string> {
  serialize(value: Date): string {
    return value.toISOString();
  }
  deserialize(value: string): Date {
    return new Date(value);
  }
  distinguish(data: string | Date): data is Date {
    return data instanceof Date;
  }
}
