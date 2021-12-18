import { BerryOrm } from "../../berry-orm.class";
import { AnyEntity } from "../../entity/any-entity.type";
import { EntityField } from "../entity-field.type";
import { PropertyAccessor } from "./property.accessor";

export class FieldAccessor<
  Entity extends AnyEntity = AnyEntity,
  Field extends EntityField<Entity> = EntityField<Entity>,
> extends PropertyAccessor<Entity, Field> {
  constructor(protected orm: BerryOrm, entity: Entity, field: Field) {
    super(entity, field);
  }

  get entity(): Entity {
    return this.object;
  }

  get field(): Field {
    return this.key;
  }
}
