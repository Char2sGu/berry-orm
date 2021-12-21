import { AnyEntity } from "../entity/any-entity.type";
import { EntityData } from "../entity/entity-data/entity-data.type";
import { EntityDataExported } from "../entity/entity-data/entity-data-exported.type";
import { EntityRepresentation } from "../entity/entity-representation.type";
import { EntityType } from "../entity/entity-type.interface";
import { RelationFieldData } from "../field/field-data/relation-field-data.type";
import { FieldDiscriminator } from "../field/field-discriminator.class";
import { EntityField } from "../field/field-names/entity-field.type";
import { RelationField } from "../field/field-names/relation-field.type";
import { Collection } from "../field/field-values/collection.class";
import { PrimaryKey } from "../field/field-values/primary-key.type";
import { PrimaryKeyPossible } from "../field/field-values/primary-key-possible.type";
import { AbstractSerializer } from "../serializer/abstract.serializer";
import { NestedSerializerMap } from "../serializer/serializer-map/nested-serializer-map.type";
import { NestedSerializerMapEmpty } from "../serializer/serializer-map/nested-serializer-map-empty.type";
import { SerializerMap } from "../serializer/serializer-map/serializer-map.type";
import { SerializerMapEmpty } from "../serializer/serializer-map/serializer-map-empty.type";
import { SerializerType } from "../serializer/serializer-type.interface";
import { META, RESOLVED } from "../symbols";
import { BerryOrm } from "./berry-orm.class";
import { EntityManagerExportExpansions } from "./entity-manager-export-expansions.type";
import { EntityManagerExportExpansionsEmpty } from "./entity-manager-export-expansions-empty.type";

export class EntityManager {
  constructor(private orm: BerryOrm) {}

  resolve<
    Entity extends AnyEntity<Entity>,
    Serializers extends SerializerMap<Entity> = SerializerMapEmpty<Entity>,
  >(
    type: EntityType<Entity>,
    data: EntityData<Entity, Serializers>,
    serializers?: Serializers,
  ): Entity {
    const primaryKey = data[type.prototype[META].primary] as PrimaryKey<Entity>;
    const entity = this.orm.map.get(type, primaryKey);

    for (const k in entity[META].fields) {
      const field = k as EntityField<Entity>;
      if (!(field in data)) continue;
      if (FieldDiscriminator.isPrimaryField(entity, field)) continue;

      if (!FieldDiscriminator.isRelationField(entity, field)) {
        if (!serializers || !(field in serializers)) {
          entity[field] = data[field] as Entity[typeof field];
        } else {
          type Type = SerializerType<AbstractSerializer<Entity[typeof field]>>;
          const serializer = new (serializers[field] as Type)(this.orm);
          entity[field] = serializer.deserialize(data[field] as any);
        }
      } else {
        this.resolveRelation(entity, field, data[field]);
      }
    }

    entity[RESOLVED] = true;
    this.orm.eem.emit(entity, "resolve");

    return entity;
  }

  /**
   * Resolve the data to update the relation on the specified field of the
   * entity.
   * @param entity
   * @param field
   * @param data
   * @returns
   */
  resolveRelation<
    Entity extends AnyEntity<Entity>,
    Field extends RelationField<Entity>,
  >(
    entity: Entity,
    field: Field,
    data: RelationFieldData<Entity, Field>,
  ): void {
    this.orm.erm.clearRelations(entity, field);

    if (!data) return;

    const representations = (
      FieldDiscriminator.isRelationFieldToOne(entity, field) ? [data] : data
    ) as EntityRepresentation<Entity>[];

    representations.forEach((data) => {
      const targetEntity = this.resolveRepresentation(
        entity[META].fields[field].relation!.target(),
        data,
      );
      this.orm.erm.constructRelation(entity, field, targetEntity);
    });
  }

  /**
   * Resolve a primary key or a data object.
   * @param entity
   * @param field
   * @param representation
   * @returns
   */
  resolveRepresentation<Entity extends AnyEntity<Entity>>(
    type: EntityType<Entity>,
    representation: EntityRepresentation,
  ): AnyEntity {
    if (typeof representation == "object") {
      return this.resolve(type, representation);
    } else {
      return this.orm.map.get(type, representation);
    }
  }

  /**
   * Export data from the entity.
   * @param entity
   * @param serializers
   * @param expand
   */
  export<
    Entity extends AnyEntity<Entity>,
    Expansions extends EntityManagerExportExpansions<Entity> = EntityManagerExportExpansionsEmpty<Entity>,
    Serializers extends NestedSerializerMap<Entity> = NestedSerializerMapEmpty<Entity>,
  >(
    entity: Entity,
    expansions?: Expansions,
    serializers?: Serializers,
  ): EntityDataExported<Entity, Serializers, Expansions> {
    if (!entity[RESOLVED])
      throw new Error("Unpopulated entities cannot be exported");

    const data: Partial<EntityDataExported<Entity, Serializers, Expansions>> =
      {};

    const meta = entity[META];
    for (const k in meta.fields) {
      const field = k as EntityField<Entity>;

      if (!FieldDiscriminator.isRelationField(entity, field)) {
        const serializerType = serializers?.[
          field
        ] as SerializerType<AbstractSerializer>;
        if (!serializerType) {
          data[field] = entity[field] as any;
        } else {
          const serializer = new serializerType!(this.orm);
          const value = serializer.serialize(entity[field]);
          data[field] = value as typeof data[typeof field];
        }
      } else {
        if (!expansions?.[field]) {
          const getPrimaryKey = <Entity extends AnyEntity<Entity>>(
            entity: Entity,
          ) => entity[entity[META].primary] as PrimaryKey<Entity>;

          if (FieldDiscriminator.isRelationFieldToOne(entity, field)) {
            data[field] = getPrimaryKey(entity[field] as AnyEntity);
          } else {
            const collection = entity[field] as Collection<AnyEntity>;
            const primaryKeys: PrimaryKeyPossible[] = [];
            collection.forEach((relationEntity) => {
              primaryKeys.push(getPrimaryKey(relationEntity));
            });
          }
        } else {
          const exportNested = (entity: AnyEntity) => {
            const nestExpansions = expansions?.[field as RelationField<Entity>];
            const nestSerializers = serializers?.[field];
            return this.export(
              entity,
              typeof nestExpansions == "object" ? nestExpansions : undefined,
              nestSerializers,
            );
          };

          if (FieldDiscriminator.isRelationFieldToOne(entity, field)) {
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
