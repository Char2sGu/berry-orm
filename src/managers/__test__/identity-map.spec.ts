import { BerryOrm } from "../..";
import { BaseEntity } from "../../entity/base-entity.class";
import { Entity } from "../../meta/meta-decorators/entity.decorator";
import { Field } from "../../meta/meta-decorators/field.decorator";
import { Primary } from "../../meta/meta-decorators/primary.decorator";
import { IdentityMap } from "../identity-map.class";

describe("IdentityMap", () => {
  describe("*[Symbol.iterator]", () => {
    it("should iterate", () => {
      @Entity()
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        @Primary()
        @Field()
        id!: number;
      }

      const orm = new BerryOrm({ entities: [TestingEntity] });
      const map = new IdentityMap(orm);
      const entity = new TestingEntity(orm, 1);
      map.set(TestingEntity, 1, entity);

      for (const v of map) {
        expect(v).toEqual(["TestingEntity:1", entity]);
      }
    });
  });
});
