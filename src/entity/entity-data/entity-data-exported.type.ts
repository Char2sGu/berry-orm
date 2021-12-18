import { EntityPrimaryKey } from "../../field/entity-primary-key.type";
import { CommonField } from "../../field/field-names/common-field.type";
import { RelationField } from "../../field/field-names/relation-field.type";
import { Collection } from "../../field/field-values/collection.class";
import { AbstractSerializer } from "../../serializer/abstract.serializer";
import { NestedSerializerMap } from "../../serializer/serializer-map/nested-serializer-map.type";
import { NestedSerializerMapEmpty } from "../../serializer/serializer-map/nested-serializer-map-empty.type";
import { SerializerType } from "../../serializer/serializer-type.interface";
import { AnyEntity } from "../any-entity.type";
import { EntityManagerExportExpansions } from "../entity-manager-export-expansions.type";
import { EntityManagerExportExpansionsEmpty } from "../entity-manager-export-expansions-empty.type";

export type EntityDataExported<
  Entity extends AnyEntity,
  Serializers extends NestedSerializerMap<Entity> = NestedSerializerMapEmpty<Entity>,
  Expansions extends EntityManagerExportExpansions<Entity> = EntityManagerExportExpansionsEmpty<Entity>,
> = {
  [Field in CommonField<Entity>]: Serializers[Field] extends SerializerType<
    AbstractSerializer<Entity[Field], infer Value>
  >
    ? Value
    : Entity[Field];
} &
  {
    [Field in RelationField<Entity>]: Expansions[Field] extends true
      ? Entity[Field] extends AnyEntity
        ? EntityDataExported<
            Entity[Field],
            NestedSerializerMapUniformed<Entity[Field], Serializers[Field]>,
            RelationExpansionsUniformed<Entity[Field], Expansions[Field]>
          >
        : Entity[Field] extends Collection<infer Entity>
        ? EntityDataExported<
            Entity,
            NestedSerializerMapUniformed<Entity, Serializers[Field]>,
            RelationExpansionsUniformed<Entity, Expansions[Field]>
          >[]
        : never
      : Entity[Field] extends AnyEntity
      ? EntityPrimaryKey<Entity>
      : Entity[Field] extends Collection<AnyEntity>
      ? EntityPrimaryKey<Entity>[]
      : never;
  };

type NestedSerializerMapUniformed<
  Entity extends AnyEntity,
  Value,
> = Value extends NestedSerializerMap<Entity>
  ? Value
  : NestedSerializerMapEmpty<Entity>;

type RelationExpansionsUniformed<
  Entity extends AnyEntity,
  Value,
> = Value extends EntityManagerExportExpansions<Entity>
  ? Value
  : EntityManagerExportExpansionsEmpty<Entity>;
