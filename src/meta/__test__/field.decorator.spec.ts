import { BaseEntity } from "../../base-entity.class";
import { FIELDS, PRIMARY } from "../../symbols";
import { FieldMeta } from "../field-meta.interface";
import { Field } from "../field.decorator";

describe("@Field()", () => {
  describe("Common", () => {
    class TestingEntity extends BaseEntity<TestingEntity> {
      @Field()
      field!: unknown;
    }

    it("should define the meta", () => {
      const fields = TestingEntity.prototype[FIELDS];
      expect(fields).toBeDefined();
      expect(fields.field).toEqual<FieldMeta>({ name: "field" });
    });
  });

  describe("Primary", () => {
    class TestingEntity extends BaseEntity<TestingEntity> {
      @Field({ primary: true })
      field!: string;
    }

    it("should define the field meta", () => {
      const fields = TestingEntity.prototype[FIELDS];
      expect(fields).toBeDefined();
      expect(fields.field).toEqual<FieldMeta>({ name: "field" });
    });

    it("should define the primary meta", () => {
      expect(TestingEntity.prototype[PRIMARY]).toBe("field");
    });
  });

  describe("Relation: One", () => {
    const relation = { target: () => TestingEntity };
    class TestingEntity extends BaseEntity<TestingEntity> {
      @Field({ relation })
      field!: TestingEntity;
    }

    it("should define the meta", () => {
      const fields = TestingEntity.prototype[FIELDS];
      expect(fields).toBeDefined();
      expect(fields.field).toBeDefined();
      expect(fields.field.relation).toEqual(relation);
    });
  });

  describe("Relation: Many", () => {
    const relation = { target: () => TestingEntity, multi: true } as const;
    class TestingEntity extends BaseEntity<TestingEntity> {
      @Field({ relation })
      field!: TestingEntity[];
    }

    it("should define the meta", () => {
      const fields = TestingEntity.prototype[FIELDS];
      expect(fields).toBeDefined();
      expect(fields.field).toBeDefined();
      expect(fields.field.relation).toEqual(relation);
    });
  });
});
