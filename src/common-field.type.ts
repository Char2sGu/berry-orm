import { BaseEntity } from "./base-entity.class";
import { EntityField } from "./entity-field.type";
import { RelationField } from "./relation-field.type";

export type CommonField<Entity extends BaseEntity> = Exclude<
  EntityField<Entity>,
  /**
   * Relation fields is not possible to be `string` unless `Entity` is
   * `AnyEntity`, if so, `Exclude<string, string>` will be `never` and cause
   * type errors. So it is required to make sure this type return `string` in
   * this case.
   */
  string extends RelationField<Entity> ? never : RelationField<Entity>
>;
