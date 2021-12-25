import { BerryOrm } from "../../core/berry-orm.class";
import { AnyEntity } from "../../entity/any-entity.type";
import { RESOLVED, VERSION } from "../../symbols";
import { EntityField } from "../field-names/entity-field.type";
import { FieldAccessDeniedError } from "./field-access-denied.error";

export class BaseFieldAccessor<
  Entity extends AnyEntity = AnyEntity,
  Field extends EntityField<Entity> = EntityField<Entity>,
> {
  /**
   * Exists only after {@link BaseFieldAccessor.apply} has been invoked.
   */
  value!: Entity[Field];

  constructor(
    protected orm: BerryOrm,
    readonly entity: Entity,
    readonly field: Field,
  ) {}

  /**
   * Initialize {@link BaseFieldAccessor.value} and start the proxy.
   */
  apply(): void {
    this.value = this.entity[this.field];
    Reflect.defineProperty(this.entity, this.field, {
      configurable: true,
      get: () => this.handleGet(),
      set: (v) => this.handleSet(v),
      enumerable: true,
    });
  }

  handleGet(): Entity[Field] {
    this.checkExpiry();
    return this.value;
  }

  handleSet(newValue: Entity[Field]): void {
    this.checkExpiry();
    this.value = newValue;
    if (this.entity[RESOLVED]) this.orm.eem.emit(this.entity, "update");
  }

  private checkExpiry() {
    if (this.entity[VERSION] == this.orm.version) return;
    throw new FieldAccessDeniedError(
      this.entity,
      this.field,
      "version-conflict",
      `Entity version does not match the ORM version: ${this.entity[VERSION]}/${this.orm.version}`,
    );
  }
}
