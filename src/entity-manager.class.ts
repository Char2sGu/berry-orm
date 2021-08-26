import { EntityRelationManager } from "./entity-relation-manager.class";
import { AnyEntity } from "./entity/any-entity.type";
import { BaseEntity } from "./entity/base-entity.class";
import { EntityData } from "./entity/entity-data.type";
import { EntityType } from "./entity/entity-type.type";
import { RelationEntityRepresentation } from "./entity/relation-entity-representation.type";
import { PrimaryField } from "./field/primary-field.type";
import { RelationFieldData } from "./field/relation-field-data.type";
import { RelationField } from "./field/relation-field.type";
import { IdentityMapManager } from "./identity-map-manager.class";
import { META, POPULATED } from "./symbols";

export class EntityManager {
  constructor(
    private identityMapManager: IdentityMapManager,
    private relationManager: EntityRelationManager,
  ) {}
  /**
   * Populate the entity using the data.
   * @param type
   * @param data
   * @returns
   */
  populate<
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryField<Entity>,
  >(type: EntityType<Entity>, data: EntityData<Entity>): Entity {
    const primaryKey = data[
      type.prototype[META].fields.primary
    ] as Entity[Primary];
    const entity = this.retrieve(type, primaryKey);

    for (const k in entity[META].fields.items) {
      const field = k as keyof typeof data;
      const fieldData = data[field];

      if (!(field in data)) continue;
      if (field == entity[META].fields.primary) continue;

      const relationMeta = entity[META].fields.items[field].relation;
      if (!relationMeta) {
        entity[field as keyof Entity] =
          fieldData as unknown as Entity[keyof Entity];
      } else {
        this.populateRelationField(
          entity,
          field as RelationField<Entity>,
          fieldData as RelationFieldData<Entity>,
        );
      }
    }
    entity[POPULATED] = true;

    return entity;
  }

  /**
   * Populate the specified relation field of the entity using the data.
   * @param entity
   * @param field
   * @param data
   * @returns
   */
  populateRelationField<
    Entity extends BaseEntity,
    Field extends RelationField<Entity>,
  >(
    entity: Entity,
    field: Field,
    data: RelationFieldData<Entity, Field>,
  ): void {
    this.relationManager.clearRelations(entity, field);

    if (!data) return;

    const relationMeta = entity[META].fields.items[field].relation!;
    const representations = (
      relationMeta.multi ? data : [data]
    ) as RelationEntityRepresentation[];
    representations.forEach((data) => {
      const targetEntity = this.resolveRelationEntityRepresentation(
        entity,
        field,
        data,
      );
      this.relationManager.constructRelation(entity, field, targetEntity);
    });
  }

  /**
   * Get the reference to the target entity.
   *
   * Return the entity from the identity map if it exists, otherwise create an
   * unpopulated one in the identity map and return it.
   *
   * @param type
   * @param primaryKey
   * @returns
   */
  retrieve<
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryField<Entity>,
  >(type: EntityType<Entity>, primaryKey: Entity[Primary]): Entity {
    const map = this.identityMapManager.get(type);
    let entity = map.get(primaryKey) as Entity | undefined;
    if (!entity) {
      entity = new type(this.relationManager, primaryKey);
      map.set(primaryKey, entity);
    }
    return entity;
  }

  /**
   * Get the target relation entity from a primary key or a data object.
   * @param entity
   * @param field
   * @param reference
   * @returns
   */
  resolveRelationEntityRepresentation<Entity extends BaseEntity>(
    entity: Entity,
    field: RelationField<Entity>,
    reference: RelationEntityRepresentation,
  ): AnyEntity {
    const relationMeta = entity[META].fields.items[field].relation!;
    if (typeof reference == "object") {
      return this.populate(relationMeta.target(), reference);
    } else {
      return this.retrieve(relationMeta.target(), reference);
    }
  }
}
