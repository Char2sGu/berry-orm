import { BaseEntity } from "./entity/base-entity.class";
import { EntityPrimaryField } from "./field/entity-primary-field.type";

export class IdentityMap<Entity extends BaseEntity> extends Map<
  EntityPrimaryField<Entity>,
  Entity
> {}
