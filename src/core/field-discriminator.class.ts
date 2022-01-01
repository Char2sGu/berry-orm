import { AnyEntity } from "../entity/any-entity.type";
import { CommonField } from "../field/field-names/common-field.type";
import { EntityField } from "../field/field-names/entity-field.type";
import { PrimaryField } from "../field/field-names/primary-field.type";
import { RelationField } from "../field/field-names/relation-field.type";
import { RelationFieldToMany } from "../field/field-names/relation-field-to-many.type";
import { RelationFieldToOne } from "../field/field-names/relation-field-to-one.type";
import { META } from "../symbols";
import { BerryOrm } from "./berry-orm.class";

export class FieldDiscriminator {
  constructor(readonly orm: BerryOrm) {}

  isPrimaryField<Entity extends AnyEntity>(
    entity: Entity,
    field: EntityField<Entity>,
  ): field is PrimaryField<Entity> {
    return entity[META].primary == field;
  }

  isCommonField<Entity extends AnyEntity>(
    entity: Entity,
    field: EntityField<Entity>,
  ): field is CommonField<Entity> {
    return (
      !this.isPrimaryField(entity, field) &&
      !this.isRelationField(entity, field)
    );
  }

  isRelationField<Entity extends AnyEntity>(
    entity: Entity,
    field: EntityField<Entity>,
  ): field is RelationField<Entity> {
    return !!entity[META].fields[field].relation;
  }

  isRelationFieldToOne<Entity extends AnyEntity>(
    entity: Entity,
    field: EntityField<Entity>,
  ): field is RelationFieldToOne<Entity> {
    return (
      this.isRelationField(entity, field) &&
      !this.isRelationFieldToMany(entity, field)
    );
  }

  isRelationFieldToMany<Entity extends AnyEntity>(
    entity: Entity,
    field: EntityField<Entity>,
  ): field is RelationFieldToMany<Entity> {
    return (
      this.isRelationField(entity, field) &&
      !!entity[META].fields[field].relation!.multi
    );
  }
}
