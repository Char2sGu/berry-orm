import { BaseEntity } from "../../entity/base-entity.class";
import { META } from "../../symbols";
import { Entity } from "../entity.decorator";

describe("@Entity()", () => {
  @Entity()
  class TestingEntity extends BaseEntity<TestingEntity, "id"> {
    id!: number;
  }

  it("should define the metadata", () => {
    const meta = TestingEntity.prototype[META];
    expect(meta).toBeDefined();
    expect(meta.type).toBeDefined();
  });
});
