import { AnyEntity } from "../../entity/any-entity.type";
import { EntityFieldBase } from "./entity-field-base.type";
import { RelationField } from "./relation-field.type";

export type CommonField<Entity extends AnyEntity> = Exclude<
  EntityFieldBase<Entity>,
  /**
   * Relation fields are not possible to be `string` unless `Entity` is
   * `AnyEntity`, if so, `Exclude<string, string>` will be `never` and cause
   * type errors. So it is required to make sure this type return `string` in
   * this case.
   */
  string extends RelationField<Entity> ? never : RelationField<Entity>
>;
