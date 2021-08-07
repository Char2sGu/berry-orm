import { BaseEntity } from "./base-entity.class";
import { Entity } from "./decorators";
import { PrimaryKey } from "./decorators/primary-key.decorator";

describe("BaseEntity", () => {
  describe("._pk", () => {
    @Entity()
    class TestingEntity extends BaseEntity {
      @PrimaryKey()
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
