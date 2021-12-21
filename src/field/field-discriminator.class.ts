import { AnyEntity } from "../entity/any-entity.type";
import { META } from "../symbols";
import { CommonField } from "./field-names/common-field.type";
import { EntityField } from "./field-names/entity-field.type";
import { PrimaryField } from "./field-names/primary-field.type";
import { RelationField } from "./field-names/relation-field.type";
import { RelationFieldToMany } from "./field-names/relation-field-to-many.type";
import { RelationFieldToOne } from "./field-names/relation-field-to-one.type";

export class FieldDiscriminator {
  static isPrimaryField<Entity extends AnyEntity<Entity>>(
    entity: Entity,
    field: EntityField<Entity>,
  ): field is PrimaryField<Entity> {
    return entity[META].primary == field;
  }

  static isCommonField<Entity extends AnyEntity<Entity>>(
    entity: Entity,
    field: EntityField<Entity>,
  ): field is CommonField<Entity> {
    return (
      !this.isPrimaryField(entity, field) &&
      !this.isRelationField(entity, field)
    );
  }

  static isRelationField<Entity extends AnyEntity<Entity>>(
    entity: Entity,
    field: EntityField<Entity>,
  ): field is RelationField<Entity> {
    return !!entity[META].fields[field].relation;
  }

  static isRelationFieldToOne<Entity extends AnyEntity<Entity>>(
    entity: Entity,
    field: EntityField<Entity>,
  ): field is RelationFieldToOne<Entity> {
    return (
      this.isRelationField(entity, field) &&
      !this.isRelationFieldToMany(entity, field)
    );
  }

  static isRelationFieldToMany<Entity extends AnyEntity<Entity>>(
    entity: Entity,
    field: EntityField<Entity>,
  ): field is RelationFieldToMany<Entity> {
    return (
      this.isRelationField(entity, field) &&
      !!entity[META].fields[field].relation!.multi
    );
  }
}
