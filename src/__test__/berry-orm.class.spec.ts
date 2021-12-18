import { BerryOrm } from "../berry-orm.class";
import { BaseEntity } from "../entity/base-entity.class";
import { EntityMetaError } from "../meta/entity-meta.error";
import { Entity } from "../meta/meta-decorators/entity.decorator";
import { Field } from "../meta/meta-decorators/field.decorator";
import { Primary } from "../meta/meta-decorators/primary.decorator";
import { Relation } from "../meta/meta-decorators/relation.decorator";

describe("BerryOrm", () => {
  describe("new", () => {
    it("should instantiate correctly in the simplest case", () => {
      @Entity()
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        @Primary()
        @Field()
        id!: number;
      }
      new BerryOrm({ entities: [TestingEntity] });
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
        new BerryOrm({ entities: [TestingEntity1] });
      }).toThrowError(EntityMetaError);
    });

    it("should throw when entity class is not decorated", () => {
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        id!: number;
      }
      expect(() => {
        new BerryOrm({ entities: [TestingEntity] });
      }).toThrowError(EntityMetaError);
    });
  });
});
