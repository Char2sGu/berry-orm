import { AnyEntity } from "../../entity/any-entity.type";
import { EntityType } from "../../entity/entity-type.interface";
import { RelationField } from "../../field/field-names/relation-field.type";
import { RelationFieldToMany } from "../../field/field-names/relation-field-to-many.type";
import { RelationFieldToOne } from "../../field/field-names/relation-field-to-one.type";
import { META } from "../../symbols";
import { EntityMetaError } from "../entity-meta.error";
import { EntityMeta } from "../meta-objects/entity-meta.class";
import { EntityRelationMeta } from "../meta-objects/entity-relation-meta.class";

export const Relation =
  <
    TargetEntity extends AnyEntity<TargetEntity>,
    Multi extends boolean = false,
  >(options: {
    target: () => EntityType<TargetEntity>;
    inverse: RelationField<TargetEntity>;
    multi?: Multi;
  }) =>
  <Entity extends AnyEntity<Entity>>(
    prototype: Entity,
    field: Multi extends true
      ? RelationFieldToMany<Entity>
      : RelationFieldToOne<Entity>,
  ): void => {
    const meta = prototype[META] as EntityMeta<Entity> | undefined;
    if (!meta?.fields[field])
      throw new EntityMetaError({
        type: prototype.constructor as EntityType<Entity>,
        field,
        message: "@Field() must be applied before @Relation()",
      });

    const { target, inverse, multi } = options;
    (meta.fields[field].relation as EntityRelationMeta<TargetEntity>) =
      new EntityRelationMeta(target, inverse, multi);
  };
