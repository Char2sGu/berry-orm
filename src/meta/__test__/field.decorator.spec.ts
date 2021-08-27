import { BaseEntity, Collection, EntityMetaField, Field, META } from "../..";

describe("@Field()", () => {
  describe("Common", () => {
    class TestingEntity extends BaseEntity<TestingEntity, "id"> {
      id!: number;
      @Field()
      field!: unknown;
    }

    it("should define the meta", () => {
      const fields = TestingEntity.prototype[META]!.fields;
      expect(fields).toBeDefined();
      expect(fields.field).toEqual<EntityMetaField>({
        name: "field",
        relation: undefined,
      });
    });
  });

  describe("Primary", () => {
    class TestingEntity extends BaseEntity<TestingEntity, "field"> {
      @Field({ type: "primary" })
      field!: string;
    }

    it("should define the field meta", () => {
      const fields = TestingEntity.prototype[META]!.fields;
      expect(fields).toBeDefined();
      expect(fields.field).toEqual<EntityMetaField>({
        name: "field",
        relation: undefined,
      });
    });

    it("should define the primary meta", () => {
      expect(TestingEntity.prototype[META]!.primary).toBe("field");
    });
  });

  describe("Relation: One", () => {
    const options = {
      type: "relation",
      target: () => TestingEntity,
      inverse: "field",
    } as const;
    class TestingEntity extends BaseEntity<TestingEntity, "id"> {
      id!: number;
      @Field(options)
      field!: TestingEntity;
    }

    it("should define the meta", () => {
      const fields = TestingEntity.prototype[META]!.fields;
      expect(fields).toBeDefined();
      expect(fields.field).toBeDefined();
      const { type, ...value } = { ...options, multi: false };
      expect(fields.field.relation).toEqual(value);
    });
  });

  describe("Relation: Many", () => {
    const options = {
      type: "relation",
      target: () => TestingEntity,
      inverse: "field",
      multi: true,
    } as const;
    class TestingEntity extends BaseEntity<TestingEntity, "id"> {
      id!: number;
      @Field(options)
      field!: Collection<TestingEntity>;
    }

    it("should define the meta", () => {
      const fields = TestingEntity.prototype[META]!.fields;
      expect(fields).toBeDefined();
      expect(fields.field).toBeDefined();
      const { type, ...value } = options;
      expect(fields.field.relation).toEqual(value);
    });
  });
});
