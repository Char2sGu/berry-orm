import { BaseEntity } from "../../entity/base-entity.class";
import { EntityType } from "../../entity/entity-type.interface";
import { META } from "../../symbols";
import { EntityMetaError } from "../entity-meta.error";
import { Field } from "../field.decorator";
import { Primary } from "../primary.decorator";

describe("@Primary()", () => {
  let cls: EntityType;

  beforeEach(() => {
    cls = class TestingEntity extends BaseEntity<TestingEntity, "id"> {
      id!: number;
    };
  });

  it("should throw an error when @Field() is not applied", () => {
    expect(() => {
      Primary()(cls.prototype, "id");
    }).toThrowError(EntityMetaError);
  });

  it("should set the primary field", () => {
    Field()(cls.prototype, "id");
    Primary()(cls.prototype, "id");
    expect(cls.prototype[META]?.primary).toBe("id");
  });

  describe("Test", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class TestingEntity extends BaseEntity<TestingEntity, "id"> {
      @Primary()
      @Field()
      id!: number;
    }
  });
});
