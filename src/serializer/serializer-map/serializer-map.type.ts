import { AnyEntity } from "../../entity/any-entity.type";
import { CommonField } from "../../field/field-names/common-field.type";
import { PrimaryField } from "../../field/field-names/primary-field.type";
import { AbstractSerializer } from "../abstract.serializer";
import { SerializerType } from "../serializer-type.interface";

export type SerializerMap<Entity extends AnyEntity> = {
  [Field in CommonField<Entity> | PrimaryField<Entity>]?: SerializerType<
    AbstractSerializer<Entity[Field]>
  >;
};
