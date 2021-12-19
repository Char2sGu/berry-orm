import { AnyEntity } from "..";
import { EntityType } from "../entity/entity-type.interface";

export class EntityMetaError<Entity extends AnyEntity<Entity>> extends Error {
  constructor({
    type,
    field,
    message,
  }: {
    type: EntityType<Entity>;
    field?: string;
    message: string;
  }) {
    super();
    const prefix = field ? `[${type.name}]` : `[${type.name}:${field}]`;
    this.message = `${prefix} - ${message}`;
  }
}
