import { BaseEntity } from "../..";
import { EntityType } from "../../entity/entity-type.interface";
import { META } from "../../symbols";
import { EntityMeta } from "../entity-meta.class";
import { EntityMetaField } from "../entity-meta-field.class";
import { Field } from "../field.decorator";

describe("@Field()", () => {
  let cls: EntityType;

  beforeEach(() => {
    cls = class TestingEntity extends BaseEntity<TestingEntity, "id"> {
      id!: number;
    };
    Field()(cls.prototype, "id");
  });

  it("should define the metadata of the entity", () => {
    expect(cls.prototype[META]).toBeInstanceOf(EntityMeta);
  });

  it("should define the metadata of the field", () => {
    const meta = cls.prototype[META]?.fields.id;
    expect(meta).toBeInstanceOf(EntityMetaField);
  });
});
