import { AnyEntity } from "../entity/any-entity.type";
import { Collection } from "../field/collection.class";
import { EmptyValue } from "../field/empty-value.type";
import { EntityField } from "../field/entity-field.type";
import { PrimaryField } from "../field/primary-field.type";
import { RelationField } from "../field/relation-field.type";
import { META } from "../symbols";
import { ExtractKeys } from "../utils/extract-keys.type";
import { EntityMetaField } from "./entity-meta-field.class";
import { EntityMetaRelation } from "./entity-meta-relation.class";
import { EntityMeta } from "./entity-meta.class";
import { RelationTarget } from "./relation-target.type";

export const Field: FieldDecorator =
  (options?: FieldOptionsPrimary | FieldOptionsRelation) =>
  <Entity extends AnyEntity, Primary extends PrimaryField<Entity>>(
    prototype: Entity,
    name: EntityField<Entity>,
  ) => {
    const meta = (prototype[META] =
      prototype[META] ?? new EntityMeta(prototype));

    const fieldMeta = new EntityMetaField(name);
    meta.fields[name] = fieldMeta;

    if (options?.type == "relation")
      fieldMeta.relation = new EntityMetaRelation(
        options.target,
        options.inverse,
        options.multi,
      );

    if (options?.type == "primary") meta.primary = name as Primary;
  };

interface FieldDecorator {
  (): <Entity extends AnyEntity>(
    prototype: Entity,
    name: EntityField<Entity>,
  ) => void;

  (options: FieldOptionsPrimary): <
    Entity extends AnyEntity<Entity, Primary>,
    Primary extends PrimaryField<Entity>,
  >(
    prototype: Entity,
    name: Primary,
  ) => void;

  <TargetEntity extends AnyEntity>(
    options: FieldOptionsRelation<TargetEntity> & { multi: true },
  ): <Entity extends AnyEntity>(
    prototype: Entity,
    name: Extract<
      EntityField<Entity>,
      ExtractKeys<Entity, Collection<TargetEntity>>
    >,
  ) => void;

  <TargetEntity extends AnyEntity>(
    options: FieldOptionsRelation<TargetEntity>,
  ): <Entity extends AnyEntity>(
    prototype: Entity,
    name: Extract<
      EntityField<Entity>,
      ExtractKeys<Entity, TargetEntity | EmptyValue>
    >,
  ) => void;
}

interface FieldOptionsPrimary {
  type: "primary";
}
interface FieldOptionsRelation<Entity extends AnyEntity = AnyEntity> {
  type: "relation";
  target: RelationTarget<Entity>;
  inverse: RelationField<Entity>;
  multi?: boolean;
}
