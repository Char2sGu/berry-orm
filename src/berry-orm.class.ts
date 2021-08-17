import { AnyEntity } from ".";
import { BaseEntity } from "./entity/base-entity.class";
import { EntityData } from "./entity/entity-data.type";
import { EntityStoreManager } from "./entity/entity-store-manager.class";
import { EntityType } from "./entity/entity-type.type";
import { RelationEntityRepresentation } from "./entity/relation-entity-representation.type";
import { PrimaryKeyField } from "./field/primary-key-field.type";
import { RelationFieldData } from "./field/relation-field-data.type";
import { RelationField } from "./field/relation-field.type";
import { RelationService } from "./relation-service.class";
import { META, POPULATED } from "./symbols";

export class BerryOrm {
  private storeManager;
  private relationService;

  constructor({ entities }: { entities: EntityType<AnyEntity>[] }) {
    this.storeManager = new EntityStoreManager(entities);
    this.relationService = new RelationService(this);
  }

  /**
   * Populate the entity using the data.
   * @param type
   * @param data
   * @returns
   */
  populate<
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryKeyField<Entity>,
  >(type: EntityType<Entity>, data: EntityData<Entity>) {
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
  >(entity: Entity, field: Field, data: RelationFieldData<Entity, Field>) {
    this.relationService.clearRelations(entity, field);

    if (!data) return;

    const relationMeta = entity[META].fields.items[field].relation!;
    const representations = (
      relationMeta.multi ? data : [data]
    ) as RelationEntityRepresentation[];
    representations.forEach((data) => {
      const targetEntity =
        this.relationService.resolveRelationEntityRepresentation(
          entity,
          field,
          data,
        );
      this.relationService.constructRelation(entity, field, targetEntity);
    });
  }

  /**
   * Get the reference to the target entity.
   *
   * Return the entity from the store if it exists, otherwise create an
   * unpopulated one in the store and return it.
   *
   * @param type
   * @param primaryKey
   * @returns
   */
  retrieve<
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryKeyField<Entity>,
  >(type: EntityType<Entity>, primaryKey: Entity[Primary]) {
    const store = this.storeManager.get(type);
    let entity = store.get(primaryKey) as Entity | undefined;
    if (!entity) {
      entity = new type(this, primaryKey);
      store.set(primaryKey, entity);
    }
    return entity;
  }
}
