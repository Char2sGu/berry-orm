import { BerryOrm } from "../../../core/berry-orm.class";
import { BaseEntity } from "../../../entity/base-entity.class";
import { Entity } from "../../../meta/meta-decorators/entity.decorator";
import { Field } from "../../../meta/meta-decorators/field.decorator";
import { Primary } from "../../../meta/meta-decorators/primary.decorator";

describe("BaseFieldAccessor", () => {
  @Entity()
  class TestingEntity extends BaseEntity<TestingEntity, "id"> {
    @Primary()
    @Field()
    id!: number;

    @Field()
    value!: string;
  }

  let orm: BerryOrm;

  beforeEach(() => {
    orm = new BerryOrm({ entities: [TestingEntity] });
  });

  describe(".handleGet()", () => {
    it("should throw when the entity has expired", () => {
      const entity = orm.em.resolve(TestingEntity, { id: 1, value: "" });
      orm.reset();
      expect(() => {
        entity.value;
      }).toThrow("Entity version does not match the ORM version: 1/2");
    });
  });

  describe(".handleSet()", () => {
    it("should throw when the entity has expired", () => {
      const entity = orm.em.resolve(TestingEntity, { id: 1, value: "" });
      orm.reset();
      expect(() => {
        entity.value = "";
      }).toThrow("Entity version does not match the ORM version: 3/4");
    });
  });

  it("should be enumerable", () => {
    const entity = orm.map.get(TestingEntity, 1);
    expect(Object.entries(entity)).toEqual([
      ["id", 1],
      ["value", undefined],
    ]);
    entity.value = "value";
    expect(Object.entries(entity)).toEqual([
      ["id", 1],
      ["value", "value"],
    ]);
  });
});
