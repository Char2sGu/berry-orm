import { AnyEntity } from "../../entity/any-entity.type";
import { EntityType } from "../../entity/entity-type.interface";
import { EntityField } from "../../field/field-names/entity-field.type";
import { PrimaryKey } from "../../field/field-values/primary-key.type";
import { EntityMetaField } from "./entity-meta-field.class";

export class EntityMeta<Entity extends AnyEntity<Entity> = AnyEntity> {
  primary!: PrimaryKey<Entity>;
  fields = {} as Record<EntityField<Entity>, EntityMetaField<Entity>>;

  constructor(readonly type: EntityType<Entity>) {}
}
