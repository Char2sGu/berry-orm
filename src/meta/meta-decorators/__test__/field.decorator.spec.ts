import { BaseEntity } from "../../../entity/base-entity.class";
import { EntityType } from "../../../entity/entity-type.interface";
import { META } from "../../../symbols";
import { EntityMetaError } from "../../entity-meta.error";
import { EntityFieldMeta } from "../../meta-objects/entity-field-meta.class";
import { EntityMeta } from "../../meta-objects/entity-meta.class";
import { Field } from "../field.decorator";

describe("@Field()", () => {
  let cls: EntityType;

  beforeEach(() => {
    cls = class TestingEntity extends BaseEntity<TestingEntity, "id"> {
      id!: number;
    };
  });

  it("should define the metadata of the entity", () => {
    Field()(cls.prototype, "id");
    expect(cls.prototype[META]).toBeInstanceOf(EntityMeta);
  });

  it("should define the metadata of the field", () => {
    Field()(cls.prototype, "id");
    const meta = cls.prototype[META]?.fields.id;
    expect(meta).toBeInstanceOf(EntityFieldMeta);
  });

  it("should throw an error when applied for multiple times", () => {
    Field()(cls.prototype, "id");
    expect(() => {
      Field()(cls.prototype, "id");
    }).toThrow(EntityMetaError);
  });
});
