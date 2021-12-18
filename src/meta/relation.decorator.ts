import { AnyEntity } from "../entity/any-entity.type";
import { EntityType } from "../entity/entity-type.type";
import { EntityField } from "../field/field-names/entity-field.type";
import { RelationField } from "../field/field-names/relation-field.type";
import { Collection } from "../field/field-values/collection.class";
import { EmptyValue } from "../field/field-values/empty-value.type";
import { META } from "../symbols";
import { ExtractKeys } from "../utils/extract-keys.type";
import { EntityMetaError } from "./entity-meta.error";
import { EntityMeta } from "./meta-objects/entity-meta.class";
import { EntityMetaRelation } from "./meta-objects/entity-meta-relation.class";

export const Relation =
  <TargetEntity extends AnyEntity, Multi extends boolean = false>(options: {
    target: () => EntityType<TargetEntity>;
    inverse: RelationField<TargetEntity>;
    multi?: Multi;
  }) =>
  <Entity extends AnyEntity>(
    prototype: Entity,
    field: Multi extends true
      ? Extract<
          EntityField<Entity>,
          ExtractKeys<Entity, Collection<TargetEntity>>
        >
      : Extract<
          EntityField<Entity>,
          ExtractKeys<Entity, TargetEntity | EmptyValue>
        >,
  ): void => {
    const meta = prototype[META] as EntityMeta<Entity> | undefined;
    if (!meta?.fields[field])
      throw new EntityMetaError({
        type: prototype.constructor as EntityType<Entity>,
        field,
        message: "@Field() must be applied before @Relation()",
      });

    const { target, inverse, multi } = options;
    meta.fields[field].relation = new EntityMetaRelation<AnyEntity>(
      target,
      inverse,
      multi,
    );
  };
