import { BerryOrm } from "../berry-orm.class";
import { AnyEntity } from "../entity/any-entity.type";
import { EntityData } from "../entity/entity-data/entity-data.type";
import { EntityDataExported } from "../entity/entity-data/entity-data-exported.type";
import { EntityRepresentation } from "../entity/entity-representation.type";
import { EntityType } from "../entity/entity-type.interface";
import { RelationFieldData } from "../field/field-data/relation-field-data.type";
import { CommonField } from "../field/field-names/common-field.type";
import { EntityField } from "../field/field-names/entity-field.type";
import { PrimaryField } from "../field/field-names/primary-field.type";
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
import { EntityManagerExportExpansions } from "./entity-manager-export-expansions.type";
import { EntityManagerExportExpansionsEmpty } from "./entity-manager-export-expansions-empty.type";
import { IdentityMap } from "./identity-map.class";

export class EntityManager {
  readonly map = new IdentityMap(this.orm);

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
    const entity = this.map.get(type, primaryKey);

    for (const k in entity[META].fields) {
      const f = k as EntityField<Entity>;
      if (!(f in data)) continue;
      if (f == entity[META].primary) continue;

      const isRelationField = (field = f): field is RelationField<Entity> =>
        !!entity[META].fields[field].relation;

      if (!isRelationField(f)) {
        type FieldValue = Entity[CommonField<Entity> | PrimaryField<Entity>];
        const field = f as CommonField<Entity> | PrimaryField<Entity>;

        if (!(serializers && field in serializers)) {
          entity[field] = data[field] as FieldValue;
        } else {
          type Type = SerializerType<AbstractSerializer<FieldValue>>;
          const serializer = new (serializers[field]! as Type)(this.orm);
          entity[field] = serializer.deserialize(data[field]);
        }
      } else {
        const field = f as RelationField<Entity>;
        this.resolveRelation(entity, field, data[field]);
      }
    }

    entity[RESOLVED] = true;

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
    this.orm.rm.clearRelations(entity, field);

    if (!data) return;

    const relationMeta = entity[META].fields[field].relation!;
    const representations = (
      relationMeta.multi ? data : [data]
    ) as EntityRepresentation[];
    representations.forEach((data) => {
      const targetEntity = this.resolveRepresentation(entity, field, data);
      this.orm.rm.constructRelation(entity, field, targetEntity);
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
    entity: Entity,
    field: RelationField<Entity>,
    representation: EntityRepresentation,
  ): AnyEntity {
    const relationMeta = entity[META].fields[field].relation!;
    if (typeof representation == "object") {
      return this.resolve(relationMeta.target(), representation);
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
      const f = k as EntityField<Entity>;
      if (!meta.fields[f].relation) {
        const field = f as CommonField<Entity> | PrimaryField<Entity>;
        const serializerType = serializers?.[
          field
        ] as SerializerType<AbstractSerializer>;
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
          const getPrimaryKey = <Entity extends AnyEntity>(entity: Entity) =>
            entity[entity[META].primary] as PrimaryKey<Entity>;

          if (!relationMeta.multi) {
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
