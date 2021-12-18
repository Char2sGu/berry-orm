import { EntityType } from "../entity/entity-type.type";

export class EntityMetaError extends Error {
  constructor({
    type,
    field,
    message,
  }: {
    type: EntityType;
    field?: string;
    message: string;
  }) {
    super();
    const prefix = field ? `[${type.name}]` : `[${type.name}:${field}]`;
    this.message = `${prefix} - ${message}`;
  }
}
