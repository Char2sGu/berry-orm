import { AnyEntity } from "..";
import { BaseEntity } from "../base-entity.class";
import { Collection } from "../collection.class";
import { EmptyValue } from "../empty-value.type";
import { EntityField } from "../entity-field.type";
import { PrimaryKeyField } from "../primary-key-field.type";
import { RelationField } from "../relation-field.type";
import { RelationTarget } from "../relation-target.type";
import { META } from "../symbols";
import { ExtractKeys } from "../utils/extract-keys.type";
import { EntityMeta } from "./entity-meta.interface";

export const Field: FieldDecorator =
  (options?: FieldOptionsPrimary | FieldOptionsRelation) =>
  <Entity extends BaseEntity, Primary extends PrimaryKeyField<Entity>>(
    prototype: Entity,
    name: EntityField<Entity>,
  ) => {
    const meta = (prototype[META] =
      prototype[META] ??
      ({
        fields: { items: {} },
      } as EntityMeta<Entity, Primary>));

    meta.fields.items[name] = {
      name,
      relation:
        options?.type == "relation"
          ? {
              target: options.target,
              inverse: options.inverse,
              multi: options.multi ?? false,
            }
          : null,
    };

    if (options?.type == "primary") meta.fields.primary = name as Primary;
  };

interface FieldDecorator {
  (): <Entity extends BaseEntity>(
    prototype: Entity,
    name: EntityField<Entity>,
  ) => void;

  (options: FieldOptionsPrimary): <
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryKeyField<Entity>,
  >(
    prototype: Entity,
    name: Primary,
  ) => void;

  <TargetEntity extends BaseEntity>(
    options: FieldOptionsRelation<TargetEntity> & { multi: true },
  ): <Entity extends BaseEntity>(
    prototype: Entity,
    name: Extract<
      EntityField<Entity>,
      ExtractKeys<Entity, Collection<TargetEntity>>
    >,
  ) => void;

  <TargetEntity extends BaseEntity>(
    options: FieldOptionsRelation<TargetEntity>,
  ): <Entity extends BaseEntity>(
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
interface FieldOptionsRelation<Entity extends BaseEntity = AnyEntity> {
  type: "relation";
  target: RelationTarget<Entity>;
  inverse: RelationField<Entity>;
  multi?: boolean;
}
