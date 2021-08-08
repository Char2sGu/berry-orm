import { BaseEntity } from "../base-entity.class";
import { EntityData } from "../entity-data.type";
import { PrimaryKeyField } from "../primary-key-field.type";
import { FIELDS, PRIMARY } from "../symbols";
import { ExtractKeys } from "../utils";
import { RelationTarget } from "./relation-target.type";

export const Field: FieldDecorator =
  (options?: FieldOptions) =>
  <
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryKeyField<Entity>,
  >(
    prototype: BaseEntity,
    name: string,
  ) => {
    let fields = prototype[FIELDS] ?? (prototype[FIELDS] = {});
    fields[name] = { name };
    if (options && (options as FieldOptionsPrimary).primary)
      prototype[PRIMARY] = name as Primary;
  };

interface FieldDecorator {
  (): <Entity extends BaseEntity<Entity>>(
    prototype: Entity,
    name: keyof EntityData<Entity>,
  ) => void;

  (options: { primary: true }): <
    Entity extends BaseEntity<Entity, Primary>,
    Primary extends PrimaryKeyField<Entity>,
  >(
    prototype: Entity,
    name: Primary,
  ) => void;

  <TargetEntity extends BaseEntity<TargetEntity>>(
    options: FieldOptionsRelation<TargetEntity>,
  ): <Entity extends BaseEntity<Entity>>(
    prototype: Entity,
    name: string & ExtractKeys<Entity, TargetEntity>,
  ) => void;

  <TargetEntity extends BaseEntity<TargetEntity>>(
    options: FieldOptionsRelationMulti<TargetEntity>,
  ): <Entity extends BaseEntity<Entity>>(
    prototype: Entity,
    name: string & ExtractKeys<Entity, TargetEntity[]>,
  ) => void;
}

type FieldOptions =
  | FieldOptionsPrimary
  | FieldOptionsRelation<BaseEntity>
  | FieldOptionsRelationMulti<BaseEntity>;

interface FieldOptionsPrimary {
  primary: true;
}
interface FieldOptionsRelation<Entity extends BaseEntity<Entity>> {
  relation: { target: RelationTarget<Entity> };
}
interface FieldOptionsRelationMulti<Entity extends BaseEntity<Entity>> {
  relation: { target: RelationTarget<Entity>; multi: true };
}
