import { CommonField } from "../field/common-field.type";
import { PrimaryField } from "../field/primary-field.type";
import { RelationFieldData } from "../field/relation-field-data.type";
import { RelationField } from "../field/relation-field.type";
import { AbstractSerializer } from "../serializer/abstract.serializer";
import { SerializerMapEmpty } from "../serializer/serializer-map-empty.type";
import { SerializerMap } from "../serializer/serializer-map.type";
import { META, POPULATED } from "../symbols";
import { AnyEntity } from "./any-entity.type";
import { EntityData } from "./entity-data.type";
import { EntityRelationManager } from "./entity-relation-manager.class";
import { EntityType } from "./entity-type.type";
import { IdentityMapManager } from "./identity-map-manager.class";
import { RelationEntityRepresentation } from "./relation-entity-representation.type";

export class EntityManager {
  constructor(
    private readonly identityMapManager: IdentityMapManager,
    private readonly relationManager: EntityRelationManager,
  ) {}
  /**
   * Populate the entity using the data.
   * @param type
   * @param data
   * @returns
   */
  populate<
    Entity extends AnyEntity<Entity, Primary>,
    Primary extends PrimaryField<Entity>,
    Serializers extends SerializerMap<Entity> = SerializerMapEmpty<Entity>,
  >(
    type: EntityType<Entity>,
    data: EntityData<Entity, Serializers>,
    serializers?: Serializers,
  ): Entity {
    const primaryKey = data[type.prototype[META]!.primary] as Entity[Primary];
    const entity = this.identityMapManager.get(type).get(primaryKey);

    for (const k in entity[META]!.fields) {
      const field = k as CommonField<Entity> | RelationField<Entity>;
      const fieldData = data[field];

      if (!(field in data)) continue;
      if (field == entity[META]!.primary) continue;

      const isRelationField = (f: unknown): f is RelationField<Entity> =>
        !!entity[META]!.fields[field].relation;
      if (!isRelationField(field)) {
        type FieldValue = Entity[CommonField<Entity>];
        const commonField = field as CommonField<Entity>;
        const serializerType = serializers?.[commonField];
        if (!serializerType) {
          entity[commonField] = fieldData as FieldValue;
        } else {
          const serializer = new serializerType!(
            this.relationManager,
          ) as AbstractSerializer<FieldValue>;
          entity[commonField] = serializer.distinguish(fieldData)
            ? fieldData
            : serializer.deserialize(fieldData);
        }
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
    Entity extends AnyEntity,
    Field extends RelationField<Entity>,
  >(
    entity: Entity,
    field: Field,
    data: RelationFieldData<Entity, Field>,
  ): void {
    this.relationManager.clearRelations(entity, field);

    if (!data) return;

    const relationMeta = entity[META]!.fields[field].relation!;
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
   * Get the target relation entity from a primary key or a data object.
   * @param entity
   * @param field
   * @param reference
   * @returns
   */
  resolveRelationEntityRepresentation<Entity extends AnyEntity>(
    entity: Entity,
    field: RelationField<Entity>,
    reference: RelationEntityRepresentation,
  ): AnyEntity {
    const relationMeta = entity[META]!.fields[field].relation!;
    if (typeof reference == "object") {
      return this.populate(relationMeta.target(), reference);
    } else {
      return this.identityMapManager.get(relationMeta.target()).get(reference);
    }
  }
}
