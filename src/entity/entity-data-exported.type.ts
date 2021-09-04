import { Collection } from "../field/collection.class";
import { CommonField } from "../field/common-field.type";
import { EntityPrimaryKey } from "../field/entity-primary-key.type";
import { RelationField } from "../field/relation-field.type";
import { AbstractSerializer } from "../serializer/abstract.serializer";
import { NestedSerializerMapEmpty } from "../serializer/nested-serializer-map-empty.type";
import { NestedSerializerMap } from "../serializer/nested-serializer-map.type";
import { SerializerType } from "../serializer/serializer-type.interface";
import { AnyEntity } from "./any-entity.type";
import { RelationExpansionsEmpty } from "./relation-expansions-empty.type";
import { RelationExpansions } from "./relation-expansions.type";

export type EntityDataExported<
  Entity extends AnyEntity,
  Serializers extends NestedSerializerMap<Entity> = NestedSerializerMapEmpty<Entity>,
  Expansions extends RelationExpansions<Entity> = RelationExpansionsEmpty<Entity>,
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
> = Value extends RelationExpansions<Entity>
  ? Value
  : RelationExpansionsEmpty<Entity>;