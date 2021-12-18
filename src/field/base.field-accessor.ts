import { BerryOrm } from "../berry-orm.class";
import { AnyEntity } from "../entity/any-entity.type";
import { BaseAccessor } from "../utils/base.accessor";
import { EntityField } from "./entity-field.type";

export class BaseFieldAccessor<
  Entity extends AnyEntity = AnyEntity,
  Field extends EntityField<Entity> = EntityField<Entity>,
> extends BaseAccessor<Entity, Field> {
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
