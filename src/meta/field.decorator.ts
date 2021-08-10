import { AnyEntity } from "../any-entity.type";
import { BaseEntity } from "../base-entity.class";
import { EntityField } from "../entity-field.type";
import { PrimaryKeyField } from "../primary-key-field.type";
import { RelationField } from "../relation-field.type";
import { FIELDS, PRIMARY } from "../symbols";
import { ExtractKeys } from "../utils";
import { RelationTarget } from "./relation-target.type";

export const Field: FieldDecorator =
  (options?: FieldOptions) =>
  <
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryKeyField<Entity>,
  >(
    prototype: Entity,
    name: string,
  ) => {
    let fields = prototype[FIELDS] ?? (prototype[FIELDS] = {});
    fields[name] = { name };

    if (!options) return;

    if ("primary" in options) prototype[PRIMARY] = name as Primary;
    if ("target" in options)
      fields[name] = { ...fields[name], relation: options };
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
    options: FieldOptionsRelationMulti<TargetEntity>,
  ): <Entity extends BaseEntity>(
    prototype: Entity,
    name: string & ExtractKeys<Entity, TargetEntity[]>,
  ) => void;

  <TargetEntity extends BaseEntity>(
    options: FieldOptionsRelation<TargetEntity>,
  ): <Entity extends BaseEntity>(
    prototype: Entity,
    name: string & ExtractKeys<Entity, TargetEntity>,
  ) => void;
}

type FieldOptions =
  | FieldOptionsPrimary
  | FieldOptionsRelation
  | FieldOptionsRelationMulti;

interface FieldOptionsPrimary {
  primary: true;
}
interface FieldOptionsRelation<Entity extends BaseEntity = AnyEntity> {
  target: RelationTarget<Entity>;
  inverse: RelationField<Entity>;
}
interface FieldOptionsRelationMulti<Entity extends BaseEntity = AnyEntity>
  extends FieldOptionsRelation {
  multi: true;
}
