import { BaseEntity } from "../../entity/base-entity.class";
import { IdentityMap } from "../../entity/identity-map.class";
import { META } from "../../symbols";
import { Entity } from "../entity.decorator";

describe("@Entity()", () => {
  describe("Defaults", () => {
    @Entity()
    class TestingEntity extends BaseEntity {
      id!: number;
    }

    it("should define the metadata", () => {
      const meta = TestingEntity.prototype[META];
      expect(meta).toBeDefined();
      expect(meta.type).toBeDefined();
      expect(meta.map).toBeDefined();
    });
  });

  describe("Map", () => {
    const map = new IdentityMap();

    @Entity({ map: () => map })
    class TestingEntity extends BaseEntity {
      id!: number;
    }

    it("should define the metadata", () => {
      const meta = TestingEntity.prototype[META];
      expect(meta).toBeDefined();
      expect(meta.type).toBeDefined();
      expect(meta.map).toBeDefined();
      expect(meta.map()).toBe(map);
    });
  });
});
