import { PrimaryField } from "..";
import { BerryOrm } from "../berry-orm.class";
import { AnyEntity } from "../entity/any-entity.type";
import { EntityData } from "../entity/entity-data/entity-data.type";
import { EntityDataExported } from "../entity/entity-data/entity-data-exported.type";
import { EntityType } from "../entity/entity-type.interface";
import { EntityPrimaryKey } from "../field/entity-primary-key.type";
import { RelationFieldData } from "../field/field-data/relation-field-data.type";
import { RelationFieldValueRepresentation } from "../field/field-data/relation-field-value-representation.type";
import { CommonField } from "../field/field-names/common-field.type";
import { EntityField } from "../field/field-names/entity-field.type";
import { RelationField } from "../field/field-names/relation-field.type";
import { Collection } from "../field/field-values/collection.class";
import { PrimaryKey } from "../field/field-values/primary-key.type";
import { AbstractSerializer } from "../serializer/abstract.serializer";
import { NestedSerializerMap } from "../serializer/serializer-map/nested-serializer-map.type";
import { NestedSerializerMapEmpty } from "../serializer/serializer-map/nested-serializer-map-empty.type";
import { SerializerMap } from "../serializer/serializer-map/serializer-map.type";
import { SerializerMapEmpty } from "../serializer/serializer-map/serializer-map-empty.type";
import { META, POPULATED } from "../symbols";
import { EntityManagerExportExpansions } from "./entity-manager-export-expansions.type";
import { EntityManagerExportExpansionsEmpty } from "./entity-manager-export-expansions-empty.type";
import { IdentityMap } from "./identity-map.class";

export class EntityManager {
  readonly map = new IdentityMap(this.orm);

  constructor(private orm: BerryOrm) {}

  fork(): EntityManager {
    return new EntityManager(this.orm);
  }

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
    const entity = this.map.get(type, primaryKey);

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
            this.orm,
          ) as AbstractSerializer<FieldValue>;
          entity[commonField] = serializer.deserialize(fieldData);
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
    this.orm.rm.clearRelations(entity, field);

    if (!data) return;

    const relationMeta = entity[META]!.fields[field].relation!;
    const representations = (
      relationMeta.multi ? data : [data]
    ) as RelationFieldValueRepresentation[];
    representations.forEach((data) => {
      const targetEntity = this.resolveRelationRepresentation(
        entity,
        field,
        data,
      );
      this.orm.rm.constructRelation(entity, field, targetEntity);
    });
  }

  /**
   * Get the target relation entity from a primary key or a data object.
   * @param entity
   * @param field
   * @param representation
   * @returns
   */
  resolveRelationRepresentation<Entity extends AnyEntity>(
    entity: Entity,
    field: RelationField<Entity>,
    representation: RelationFieldValueRepresentation,
  ): AnyEntity {
    const relationMeta = entity[META]!.fields[field].relation!;
    if (typeof representation == "object") {
      return this.populate(relationMeta.target(), representation);
    } else {
      return this.map.get(relationMeta.target(), representation);
    }
  }

  /**
   * Export data from the entity.
   * @param entity
   * @param serializers
   * @param expand
   */
  export<
    Entity extends AnyEntity,
    Expansions extends EntityManagerExportExpansions<Entity> = EntityManagerExportExpansionsEmpty<Entity>,
    Serializers extends NestedSerializerMap<Entity> = NestedSerializerMapEmpty<Entity>,
  >(
    entity: Entity,
    expansions?: Expansions,
    serializers?: Serializers,
  ): EntityDataExported<Entity, Serializers, Expansions> {
    if (!entity[POPULATED])
      throw new Error("Unpopulated entities cannot be exported");

    const data: Partial<EntityDataExported<Entity, Serializers, Expansions>> =
      {};
    const meta = entity[META]!;
    for (const k in meta.fields) {
      const f = k as EntityField<Entity>;
      if (!meta.fields[f].relation) {
        const field = f as CommonField<Entity>;
        const serializerType = serializers?.[field];
        if (!serializerType) {
          data[field] = entity[field];
        } else {
          const serializer = new serializerType!(this.orm);
          const value = serializer.serialize(entity[field]);
          data[field] = value as typeof data[typeof field];
        }
      } else {
        const field = f as RelationField<Entity>;
        const relationMeta = meta.fields[field].relation!;
        if (!expansions?.[field]) {
          const getPrimaryKey = <Entity extends AnyEntity>(
            entity: Entity,
          ): EntityPrimaryKey<Entity> => entity[entity[META]!.primary];

          if (!relationMeta.multi) {
            data[field] = getPrimaryKey(entity[field] as AnyEntity);
          } else {
            const collection = entity[field] as Collection<AnyEntity>;
            const primaryKeys: PrimaryKey[] = [];
            collection.forEach((relationEntity) => {
              primaryKeys.push(getPrimaryKey(relationEntity));
            });
          }
        } else {
          const exportNested = (entity: AnyEntity) => {
            const nestExpansions = expansions?.[field];
            const nestSerializers = serializers?.[field];
            return this.export(
              entity,
              typeof nestExpansions == "object" ? nestExpansions : undefined,
              nestSerializers,
            );
          };

          if (!relationMeta.multi) {
            data[field] = exportNested(
              entity[field] as AnyEntity,
            ) as typeof data[typeof field];
          } else {
            const collection = entity[field] as Collection<AnyEntity>;
            const dataList: EntityData<AnyEntity>[] = [];
            collection.forEach((relationEntity) => {
              dataList.push(exportNested(relationEntity));
            });
            data[field] = dataList as typeof data[typeof field];
          }
        }
      }
    }

    return data as EntityDataExported<Entity, Serializers, Expansions>;
  }
}
