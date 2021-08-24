import { AnyEntity } from "../entity/any-entity.type";
import { BaseEntity } from "../entity/base-entity.class";
import { EntityType } from "../entity/entity-type.type";
import { IdentityMap } from "../entity/identity-map.class";
import { PrimaryField } from "../field/primary-field.type";
import { META } from "../symbols";
import { EntityMeta } from "./entity-meta.interface";

export const Entity =
  (options?: EntityOptions) =>
  <
    Entity extends BaseEntity<Entity, Primary> = AnyEntity,
    Primary extends PrimaryField<Entity> = PrimaryField<Entity>,
  >(
    type: EntityType<Entity>,
  ): void => {
    const meta = (type.prototype[META] =
      type.prototype[META] ?? ({} as EntityMeta<Entity, Primary>));
    meta.type = type;
    meta.map =
      (options?.map as () => IdentityMap<Entity>) ?? (() => new IdentityMap());
  };

interface EntityOptions {
  /**
   * Speicify a custom map to store references of this type of entities.
   */
  map?: () => IdentityMap<AnyEntity>;
}
