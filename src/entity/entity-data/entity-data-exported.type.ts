import { EntityManagerExportExpansions } from "../../core/entity-manager-export-expansions.type";
import { EntityManagerExportExpansionsEmpty } from "../../core/entity-manager-export-expansions-empty.type";
import { CommonField } from "../../field/field-names/common-field.type";
import { PrimaryField } from "../../field/field-names/primary-field.type";
import { RelationField } from "../../field/field-names/relation-field.type";
import { RelationFieldToMany } from "../../field/field-names/relation-field-to-many.type";
import { RelationFieldToOne } from "../../field/field-names/relation-field-to-one.type";
import { PrimaryKey } from "../../field/field-values/primary-key.type";
import { AbstractSerializer } from "../../serializer/abstract.serializer";
import { NestedSerializerMap } from "../../serializer/serializer-map/nested-serializer-map.type";
import { NestedSerializerMapEmpty } from "../../serializer/serializer-map/nested-serializer-map-empty.type";
import { SerializerType } from "../../serializer/serializer-type.interface";
import { AnyEntity } from "../any-entity.type";

export type EntityDataExported<
  Entity extends AnyEntity<Entity>,
  Serializers extends NestedSerializerMap<Entity> = NestedSerializerMapEmpty<Entity>,
  Expansions extends EntityManagerExportExpansions<Entity> = EntityManagerExportExpansionsEmpty<Entity>,
> = {
  [Field in
    | CommonField<Entity>
    | PrimaryField<Entity>]: Serializers[Field] extends SerializerType<
    AbstractSerializer<Entity[Field], infer Value>
  >
    ? Value
    : Entity[Field];
} &
  {
    [Field in RelationField<Entity>]: Expansions[Field] extends true
      ? Field extends RelationFieldToOne<Entity>
        ? EntityDataExported<
            Entity[Field],
            NestedSerializerMapUniformed<Entity[Field], Serializers[Field]>,
            RelationExpansionsUniformed<Entity[Field], Expansions[Field]>
          >
        : Field extends RelationFieldToMany<Entity>
        ? EntityDataExported<
            Entity,
            NestedSerializerMapUniformed<Entity, Serializers[Field]>,
            RelationExpansionsUniformed<Entity, Expansions[Field]>
          >[]
        : never
      : Field extends RelationFieldToOne<Entity>
      ? PrimaryKey<Entity>
      : Field extends RelationFieldToMany<Entity>
      ? PrimaryKey<Entity>[]
      : never;
  };

type NestedSerializerMapUniformed<
  Entity extends AnyEntity<Entity>,
  Value,
> = Value extends NestedSerializerMap<Entity>
  ? Value
  : NestedSerializerMapEmpty<Entity>;

type RelationExpansionsUniformed<
  Entity extends AnyEntity<Entity>,
  Value,
> = Value extends EntityManagerExportExpansions<Entity>
  ? Value
  : EntityManagerExportExpansionsEmpty<Entity>;
