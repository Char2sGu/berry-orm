import { AnyEntity } from "../entity/any-entity.type";
import { Collection } from "../field/collection.class";
import { EmptyValue } from "../field/empty-value.type";
import { EntityField } from "../field/entity-field.type";
import { RelationField } from "../field/relation-field.type";
import { META } from "../symbols";
import { ExtractKeys } from "../utils/extract-keys.type";
import { EntityMetaRelation } from "./entity-meta-relation.class";
import { EntityMeta } from "./entity-meta.class";
import { EntityMetaError } from "./entity-meta.error";
import { RelationTarget } from "./relation-target.type";

export const Relation =
  <TargetEntity extends AnyEntity, Multi extends boolean = false>(options: {
    target: RelationTarget<TargetEntity>;
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
        type: new EntityMeta(prototype).type,
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
