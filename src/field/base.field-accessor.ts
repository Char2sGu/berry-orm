import { AnyEntity } from "..";
import { EntityRelationManager } from "../entity/entity-relation-manager.class";
import { BaseAccessor } from "../utils/base.accessor";
import { EntityField } from "./entity-field.type";

export class BaseFieldAccessor<
  Entity extends AnyEntity = AnyEntity,
  Field extends EntityField<Entity> = EntityField<Entity>,
> extends BaseAccessor<Entity, Field> {
  constructor(
    protected relationManager: EntityRelationManager,
    entity: Entity,
    field: Field,
  ) {
    super(entity, field);
  }

  get entity(): Entity {
    return this.object;
  }

  get field(): Field {
    return this.key;
  }
}
