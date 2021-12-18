import { BerryOrm } from "../../berry-orm.class";
import { AnyEntity } from "../../entity/any-entity.type";
import { EntityField } from "../entity-field.type";

export class BaseFieldAccessor<
  Entity extends AnyEntity = AnyEntity,
  Field extends EntityField<Entity> = EntityField<Entity>,
> {
  value = this.entity[this.field];

  constructor(
    protected orm: BerryOrm,
    readonly entity: Entity,
    readonly field: Field,
  ) {}

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
