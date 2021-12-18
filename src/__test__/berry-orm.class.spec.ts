import { BerryOrm } from "../berry-orm.class";
import { BaseEntity } from "../entity/base-entity.class";
import { Entity } from "../meta/entity.decorator";
import { EntityMetaError } from "../meta/entity-meta.error";
import { Field } from "../meta/field.decorator";
import { Primary } from "../meta/primary.decorator";
import { Relation } from "../meta/relation.decorator";

describe("BerryOrm", () => {
  describe("static .inspect()", () => {
    it("should instantiate correctly in the simplest case", () => {
      @Entity()
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        @Primary()
        @Field()
        id!: number;
      }
      BerryOrm.inspect(new Set([TestingEntity]));
    });

    it("should throw when relation entity is not registered", () => {
      @Entity()
      class TestingEntity1 extends BaseEntity<TestingEntity1, "id"> {
        @Primary()
        @Field()
        id!: number;

        @Relation({ target: () => TestingEntity2, inverse: "entity" })
        @Field()
        entity!: TestingEntity2;
      }

      @Entity()
      class TestingEntity2 extends BaseEntity<TestingEntity2, "id"> {
        @Primary()
        @Field()
        id!: number;

        @Relation({ target: () => TestingEntity1, inverse: "entity" })
        @Field()
        entity!: TestingEntity1;
      }

      expect(() => {
        BerryOrm.inspect(new Set([TestingEntity1]));
      }).toThrowError(EntityMetaError);
    });

    it("should throw when entity class is not decorated", () => {
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        id!: number;
      }
      expect(() => {
        BerryOrm.inspect(new Set([TestingEntity]));
      }).toThrowError(EntityMetaError);
    });
  });
});
