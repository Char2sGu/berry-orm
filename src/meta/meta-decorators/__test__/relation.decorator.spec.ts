import { BaseEntity } from "../../../entity/base-entity.class";
import { EntityType } from "../../../entity/entity-type.type";
import { Collection } from "../../../field/field-values/collection.class";
import { EntityMetaError } from "../../entity-meta.error";
import { Field } from "../field.decorator";
import { Relation } from "../relation.decorator";

describe("@Relation()", () => {
  let cls: EntityType;

  beforeEach(() => {
    cls = class TestingEntity extends BaseEntity<TestingEntity, "id"> {
      id!: number;
    };
  });

  it("should throw an error when @Field() is not applied", () => {
    expect(() => {
      Relation({ target: () => cls, inverse: "" })(cls.prototype, "a");
    }).toThrowError(EntityMetaError);
  });

  it("should define the relation metadata", () => {
    Field()(cls.prototype, "a");
    Relation({ target: () => cls, inverse: "" });
  });

  describe("Type", () => {
    describe("ToOne", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        id!: number;

        @Relation({ target: () => TestingEntity, inverse: "entity" })
        @Field()
        entity!: TestingEntity;
      }
    });

    describe("ToMany", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        id!: number;

        @Relation({
          target: () => TestingEntity,
          inverse: "entities",
          multi: true,
        })
        @Field()
        entities!: Collection<TestingEntity>;
      }
    });
  });
});
