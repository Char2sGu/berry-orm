import { AnyEntity } from "..";
import { EntityManager } from "../entity-manager.class";
import { BaseEntity } from "../entity/base-entity.class";
import { EntityField } from "./entity-field.type";

export class BaseFieldAccessor<
  Entity extends BaseEntity = AnyEntity,
  Field extends EntityField<Entity> = EntityField<Entity>,
> {
  value;

  constructor(
    protected em: EntityManager,
    protected entity: Entity,
    protected field: Field,
  ) {
    this.value = entity[field];
  }

  apply() {
    Reflect.defineProperty(this.entity, this.field, {
      configurable: true,
      get: () => this.handleGet(),
      set: (v) => this.handleSet(v),
    });
  }

  handleGet() {
    return this.value;
  }

  handleSet(newValue: Entity[Field]) {
    this.value = newValue;
  }
}
