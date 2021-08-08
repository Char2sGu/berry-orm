import { BaseEntity } from "../base-entity.class";
import { EntityData } from "../entity-data.type";
import { PrimaryKeyField } from "../primary-key-field.type";
import { FIELDS, PRIMARY } from "../symbols";
import { ExtractKeys } from "../utils";
import { RelationTarget } from "./relation-target.type";

export const Field: FieldDecorator =
  (options?: FieldOptions) =>
  <T extends BaseEntity<T, Primary>, Primary extends PrimaryKeyField<T>>(
    prototype: BaseEntity,
    name: string,
  ) => {
    let fields = prototype[FIELDS] ?? (prototype[FIELDS] = {});
    fields[name] = { name };
    if (options && (options as FieldOptionsPrimary).primary)
      prototype[PRIMARY] = name as Primary;
  };

interface FieldDecorator {
  (): <T extends BaseEntity<T>>(
    prototype: T,
    name: keyof EntityData<T>,
  ) => void;

  (options: { primary: true }): <
    T extends BaseEntity<T, Primary>,
    Primary extends PrimaryKeyField<T>,
  >(
    prototype: T,
    name: Primary,
  ) => void;

  <TargetEntity extends BaseEntity<TargetEntity>>(
    options: FieldOptionsRelation<TargetEntity>,
  ): <T extends BaseEntity<T>>(
    prototype: T,
    name: string & ExtractKeys<T, TargetEntity>,
  ) => void;

  <TargetEntity extends BaseEntity<TargetEntity>>(
    options: FieldOptionsRelationMulti<TargetEntity>,
  ): <T extends BaseEntity<T>>(
    prototype: T,
    name: string & ExtractKeys<T, TargetEntity[]>,
  ) => void;
}

type FieldOptions =
  | FieldOptionsPrimary
  | FieldOptionsRelation<BaseEntity>
  | FieldOptionsRelationMulti<BaseEntity>;

interface FieldOptionsPrimary {
  primary: true;
}
interface FieldOptionsRelation<T extends BaseEntity<T>> {
  relation: { target: RelationTarget<T> };
}
interface FieldOptionsRelationMulti<T extends BaseEntity<T>> {
  relation: { target: RelationTarget<T>; multi: true };
}
