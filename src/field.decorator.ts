import {
  AnyEntity,
  BaseEntity,
  Collection,
  EmptyValue,
  EntityField,
  ExtractKeys,
  FIELDS,
  PRIMARY,
  PrimaryKeyField,
  RelationField,
  RelationTarget,
} from ".";

export const Field: FieldDecorator =
  (options?: FieldOptionsPrimary | FieldOptionsRelation) =>
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

    if (options.type == "primary") prototype[PRIMARY] = name as Primary;
    if (options.type == "relation") fields[name].relation = options;
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
    name: Extract<ExtractKeys<Entity, Collection<TargetEntity>>, string>,
  ) => void;

  <TargetEntity extends BaseEntity>(
    options: FieldOptionsRelation<TargetEntity>,
  ): <Entity extends BaseEntity>(
    prototype: Entity,
    name: Extract<ExtractKeys<Entity, TargetEntity | EmptyValue>, string>,
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
