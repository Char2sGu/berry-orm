import { BaseEntity } from "../../../entity/base-entity.class";
import { EntityType } from "../../../entity/entity-type.interface";
import { META } from "../../../symbols";
import { EntityMetaError } from "../../entity-meta.error";
import { EntityMeta } from "../../meta-objects/entity-meta.class";
import { Entity } from "../entity.decorator";

describe("@Entity()", () => {
  let cls: EntityType;

  beforeEach(() => {
    cls = class TestingEntity extends BaseEntity<TestingEntity, "id"> {
      id!: number;
    };
  });

  it("should throw an error when there are no metadata defined", () => {
    expect(() => {
      Entity()(cls);
    }).toThrowError(EntityMetaError);
  });

  it("should pass when there are metadata defined", () => {
    cls.prototype[META] = new EntityMeta(cls);
    expect(() => {
      Entity()(cls);
    }).not.toThrowError();
  });
});
