import { AnyEntity } from "..";
import { BerryOrm } from "../berry-orm.class";
import { BaseEntity } from "../entity/base-entity.class";
import { EntityField } from "./entity-field.type";
import { PerformSet } from "./perform-set.interface";

export class CommonFieldAccessor<
  Entity extends BaseEntity = AnyEntity,
  Field extends EntityField<Entity> = EntityField<Entity>,
> {
  constructor() {}

  apply(orm: BerryOrm, entity: Entity, field: Field) {
    let currentValue = entity[field];
    Reflect.defineProperty(entity, field, {
      configurable: true,
      get: () => {
        return this.handleGet(currentValue, orm, entity, field);
      },
      set: (newValue: Entity[Field]) => {
        const performSet: PerformSet<Entity[Field]> = (newValue) => {
          currentValue = newValue;
        };
        this.handleSet(performSet, newValue, currentValue, orm, entity, field);
      },
    });
  }

  handleGet(
    currentValue: Entity[Field],
    orm: BerryOrm,
    entity: Entity,
    field: Field,
  ) {
    return currentValue;
  }

  handleSet(
    performSet: PerformSet<Entity[Field]>,
    newValue: Entity[Field],
    currentValue: Entity[Field],
    orm: BerryOrm,
    entity: Entity,
    field: Field,
  ) {
    performSet(newValue);
  }
}
