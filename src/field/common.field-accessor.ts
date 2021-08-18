import { AnyEntity } from "..";
import { EntityManager } from "../entity-manager.class";
import { BaseEntity } from "../entity/base-entity.class";
import { EntityField } from "./entity-field.type";
import { PerformSet } from "./perform-set.interface";

export class CommonFieldAccessor<
  Entity extends BaseEntity = AnyEntity,
  Field extends EntityField<Entity> = EntityField<Entity>,
> {
  constructor() {}

  apply(em: EntityManager, entity: Entity, field: Field) {
    let currentValue = entity[field];
    Reflect.defineProperty(entity, field, {
      configurable: true,
      get: () => {
        return this.handleGet(currentValue, em, entity, field);
      },
      set: (newValue: Entity[Field]) => {
        const performSet: PerformSet<Entity[Field]> = (newValue) => {
          currentValue = newValue;
        };
        this.handleSet(performSet, newValue, currentValue, em, entity, field);
      },
    });
  }

  handleGet(
    currentValue: Entity[Field],
    em: EntityManager,
    entity: Entity,
    field: Field,
  ) {
    return currentValue;
  }

  handleSet(
    performSet: PerformSet<Entity[Field]>,
    newValue: Entity[Field],
    currentValue: Entity[Field],
    em: EntityManager,
    entity: Entity,
    field: Field,
  ) {
    performSet(newValue);
  }
}
