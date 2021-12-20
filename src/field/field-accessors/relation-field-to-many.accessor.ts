import { AnyEntity } from "../../entity/any-entity.type";
import { RelationFieldToMany } from "../field-names/relation-field-to-many.type";
import { Collection } from "../field-values/collection.class";
import { BaseFieldAccessor } from "./base-field.accessor";
import { FieldAccessDeniedError } from "./field-access-denied.error";

export class RelationFieldToManyAccessor<
  Entity extends AnyEntity<Entity> = AnyEntity,
  Field extends RelationFieldToMany<Entity> = RelationFieldToMany<Entity>,
> extends BaseFieldAccessor<Entity, Field> {
  value = new Collection(this.orm, this.entity, this.field) as Entity[Field];

  handleSet(): void {
    throw new FieldAccessDeniedError(
      this.entity,
      this.field,
      "readonly",
      "Collection fields are readonly",
    );
  }
}
