import { AnyEntity } from "..";
import { EntityRelationManager } from "../entity/entity-relation-manager.class";
import { EntityField } from "./entity-field.type";

export class BaseFieldAccessor<
  Entity extends AnyEntity = AnyEntity,
  Field extends EntityField<Entity> = EntityField<Entity>,
> {
  value;

  constructor(
    protected relationManager: EntityRelationManager,
    protected entity: Entity,
    protected field: Field,
  ) {
    this.value = entity[field];
  }

  apply(): void {
    Reflect.defineProperty(this.entity, this.field, {
      configurable: true,
      get: () => this.handleGet(),
      set: (v) => this.handleSet(v),
    });
  }

  handleGet(): Entity[Field] {
    return this.value;
  }

  handleSet(newValue: Entity[Field]): void {
    this.value = newValue;
  }
}
