import { AnyEntity } from "../entity/any-entity.type";
import { EntityType } from "../entity/entity-type.interface";
import { EntityField } from "../field/entity-field.type";
import { EntityPrimaryField } from "../field/entity-primary-field.type";
import { META } from "../symbols";
import { EntityMetaError } from "./entity-meta.error";
import { EntityMetaField } from "./entity-meta-field.class";

export class EntityMeta<
  Entity extends AnyEntity = AnyEntity,
  Primary extends EntityPrimaryField<Entity> = EntityPrimaryField<Entity>,
> {
  readonly type;
  primary!: Primary;
  fields = {} as Record<EntityField<Entity>, EntityMetaField<Entity>>;

  constructor(prototype: Entity) {
    this.type = prototype.constructor as EntityType<Entity>;
  }

  /**
   *
   * Check whether the decorators are applied correctly in this entity.
   * @param mutual - Specify whether to check the other side of the relation.
   */
  inspect(): void {
    if (!this.primary)
      throw new EntityMetaError({
        type: this.type,
        message: "Must have a primary field registered",
      });

    for (const k in this.fields) {
      const field = k as EntityField<Entity>;
      const meta = this.fields[field];
      if (meta.relation) {
        const inverseMeta =
          meta.relation.target().prototype[META]!.fields[meta.relation.inverse];
        if (!inverseMeta.relation)
          throw new EntityMetaError({
            type: this.type,
            field,
            message: "The inverse side must be a relation field",
          });
        if (inverseMeta.relation.target() != this.type)
          throw new EntityMetaError({
            type: this.type,
            field,
            message: "The inverse side must point back to this entity",
          });
        if (inverseMeta.relation.inverse != field)
          throw new EntityMetaError({
            type: this.type,
            field,
            message:
              "The inverse side of the inverse side must point back to this field",
          });
      }
    }
  }
}
