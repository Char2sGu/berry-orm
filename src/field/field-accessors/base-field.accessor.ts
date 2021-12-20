import { BerryOrm } from "../../core/berry-orm.class";
import { AnyEntity } from "../../entity/any-entity.type";
import { VERSION } from "../../symbols";
import { EntityField } from "../field-names/entity-field.type";

export class BaseFieldAccessor<
  Entity extends AnyEntity<Entity> = AnyEntity,
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
    this.checkExpiry();
    return this.value;
  }

  handleSet(newValue: Entity[Field]): void {
    this.checkExpiry();
    this.value = newValue;
  }

  private checkExpiry() {
    if (this.entity[VERSION] == this.orm.version) return;
    throw new Error(
      `Entity version not matched: ${this.entity[VERSION]}/${this.orm.version}`,
    );
  }
}
