import { BaseEntity } from "./base-entity.class";
import { Entity, Field } from "./meta";
import { PK } from "./symbols";

describe("BaseEntity", () => {
  describe(".[PK]", () => {
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
      expect(entity[PK]).toBe("1");
    });
  });
});
