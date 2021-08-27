import { BaseEntity } from "../../entity/base-entity.class";
import { META } from "../../symbols";
import { EntityMeta } from "../entity-meta.class";
import { EntityMetaError } from "../entity-meta.error";
import { Entity } from "../entity.decorator";

describe("@Entity()", () => {
  class TestingEntity extends BaseEntity<TestingEntity, "id"> {
    id!: number;
  }

  it("should throw an error when there are no metadata defined", () => {
    expect(() => {
      Entity()(TestingEntity);
    }).toThrowError(EntityMetaError);
  });

  it("should pass when there are metadata defined", () => {
    TestingEntity.prototype[META] = new EntityMeta(TestingEntity.prototype);
    expect(() => {
      Entity()(TestingEntity);
    }).not.toThrowError();
  });
});
