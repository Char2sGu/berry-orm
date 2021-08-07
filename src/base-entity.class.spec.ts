import { BaseEntity } from "./base-entity.class";
import { Entity, Field } from "./meta";

describe("BaseEntity", () => {
  describe("._pk", () => {
    @Entity()
    class TestingEntity extends BaseEntity {
      @Field({ primary: true })
      id!: number;
    }

    let entity: TestingEntity;

    beforeEach(() => {
      entity = new TestingEntity();
      entity.id = 1;
    });

    it("should return the stringified primary key", () => {
      expect(entity._pk).toBe("1");
    });
  });
});
