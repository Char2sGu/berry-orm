import { BaseEntity } from "..";
import { EntityData } from "../entity-data.type";
import { EntityManager } from "../entity-manager.class";
import { FIELDS, POPULATED, PRIMARY, TYPE } from "../symbols";

describe("EntityManager", () => {
  describe(".commit()", () => {
    describe("Values", () => {
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        id!: number;
        field1!: string;
        field2!: Date;
      }
      TestingEntity.prototype[TYPE] = TestingEntity;
      TestingEntity.prototype[PRIMARY] = "id";
      TestingEntity.prototype[FIELDS] = {
        id: { name: "id" },
        field1: { name: "field1" },
        field2: { name: "field2" },
      };

      let data: EntityData<TestingEntity>;
      let entity: TestingEntity;

      beforeEach(() => {
        const em = new EntityManager({ entities: [TestingEntity] });
        data = { id: 1, field1: "", field2: new Date() };
        jest
          .spyOn(EntityManager.prototype, "retrieve")
          .mockImplementation(() => {
            const entity: TestingEntity = Object.create(
              TestingEntity.prototype,
            );
            entity.id = data.id;
            return entity;
          });

        entity = em.commit(TestingEntity, data);
      });

      it("should return an instance", () => {
        expect(entity).toBeInstanceOf(TestingEntity);
      });

      it("should assign the values to the instance", () => {
        for (const k in data) {
          const key = k as keyof typeof data;
          expect(entity[key]).toBe(data[key]);
        }
      });

      it("should call .retrieve() for only once", () => {
        expect(EntityManager.prototype.retrieve).toHaveBeenCalledTimes(1);
      });
    });

    describe("Foreign Keys", () => {
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        id!: number;
        field1!: TestingEntity;
        field2!: TestingEntity[];
      }
      TestingEntity.prototype[TYPE] = TestingEntity;
      TestingEntity.prototype[PRIMARY] = "id";
      TestingEntity.prototype[FIELDS] = {
        id: { name: "id" },
        field1: {
          name: "field1",
          relation: { target: () => TestingEntity },
        },
        field2: {
          name: "field2",
          relation: { target: () => TestingEntity, multi: true },
        },
      };

      const mockRelationEntity = {};
      let data: EntityData<TestingEntity>;
      let entity: TestingEntity;

      beforeEach(() => {
        const em = new EntityManager({ entities: [TestingEntity] });
        data = { id: 1, field1: 1, field2: [1] };
        jest
          .spyOn(EntityManager.prototype, "retrieve")
          .mockImplementationOnce(() => {
            const entity: TestingEntity = Object.create(
              TestingEntity.prototype,
            );
            entity.id = data.id;
            return entity;
          })
          .mockReturnValue(mockRelationEntity);
        entity = em.commit(TestingEntity, data);
      });

      it("should make the entity field return the entity", () => {
        expect(entity.field1).toBe(mockRelationEntity);
      });

      it("should make the entities field return an array of entities", () => {
        expect(entity.field2).toBeInstanceOf(Array);
        expect(entity.field2[0]).toBe(mockRelationEntity);
      });
    });

    describe("Nested Data", () => {
      class TestingParentEntity extends BaseEntity<TestingParentEntity, "id"> {
        id!: number;
        field1!: TestingChildEntity;
        field2!: [TestingChildEntity];
      }
      TestingParentEntity.prototype[TYPE] = TestingParentEntity;
      TestingParentEntity.prototype[PRIMARY] = "id";
      TestingParentEntity.prototype[FIELDS] = {
        id: { name: "id" },
        field1: {
          name: "field1",
          relation: { target: () => TestingChildEntity },
        },
        field2: {
          name: "field2",
          relation: { target: () => TestingChildEntity, multi: true },
        },
      };

      class TestingChildEntity extends BaseEntity<TestingChildEntity, "id"> {
        id!: number;
      }
      TestingChildEntity.prototype[TYPE] = TestingChildEntity;
      TestingChildEntity.prototype[PRIMARY] = "id";
      TestingChildEntity.prototype[FIELDS] = {
        id: { name: "id" },
      };

      const mockParent = new TestingParentEntity();
      const mockChild = new TestingChildEntity();

      let result: TestingParentEntity;

      beforeEach(() => {
        const em = new EntityManager({
          entities: [TestingParentEntity, TestingChildEntity],
        });
        jest
          .spyOn(em, "retrieve")
          .mockReturnValueOnce(mockParent)
          .mockReturnValue(mockChild);
        result = em.commit(TestingParentEntity, {
          id: 1,
          field1: { id: 1 },
          field2: [{ id: 2 }],
        });
      });

      it("should return an instance of the parent entity", () => {
        expect(result).toBeInstanceOf(TestingParentEntity);
      });

      it("should make the entity field return an entity", () => {
        expect(result.field1).toBe(mockChild);
      });

      it("should make the entities field return an array of entities", () => {
        expect(result.field2).toBeInstanceOf(Array);
        expect(result.field2[0]).toBe(mockChild);
      });
    });
  });

  describe(".retrieve()", () => {
    class TestingEntity extends BaseEntity<TestingEntity, "id"> {
      id!: number;
    }
    TestingEntity.prototype[TYPE] = TestingEntity;
    TestingEntity.prototype[PRIMARY] = "id";
    TestingEntity.prototype[FIELDS] = {
      id: { name: "id" },
    };

    let result: TestingEntity;

    beforeEach(() => {
      const em = new EntityManager({
        entities: [TestingEntity],
      });
      result = em.retrieve(TestingEntity, 1);
    });

    it("should return an instance", () => {
      expect(result).toBeInstanceOf(TestingEntity);
    });

    it("should assign to the priamry key field", () => {
      expect(result.id).toBe(1);
    });

    it("should mark it as unpopulated", () => {
      expect(result[POPULATED]).toBe(false);
    });
  });
});
