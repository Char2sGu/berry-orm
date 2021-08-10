import { BaseEntity } from "..";
import { EntityData } from "../entity-data.type";
import { EntityManager } from "../entity-manager.class";
import { Entity, Field } from "../meta";
import { POPULATED } from "../symbols";

describe("EntityManager", () => {
  let em: EntityManager;

  describe(".commit()", () => {
    describe("Values", () => {
      @Entity()
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        @Field({ primary: true })
        id!: number;

        @Field()
        field1!: string;

        @Field()
        field2!: Date;
      }

      let data: EntityData<TestingEntity>;
      let entity: TestingEntity;

      beforeEach(() => {
        em = new EntityManager({ entities: [TestingEntity] });
        data = { id: 1, field1: "", field2: new Date() };
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
    });

    describe("Relations: One", () => {
      @Entity()
      class TestingEntity1 extends BaseEntity<TestingEntity1, "id"> {
        @Field({ primary: true })
        id!: number;

        @Field({
          relation: {
            target: () => TestingEntity2,
            inverse: "entity1",
          },
        })
        entity2!: TestingEntity2;
      }

      @Entity()
      class TestingEntity2 extends BaseEntity<TestingEntity2, "id"> {
        @Field({ primary: true })
        id!: number;

        @Field({
          relation: {
            target: () => TestingEntity1,
            inverse: "entity2",
          },
        })
        entity1!: TestingEntity1;
      }

      let result: TestingEntity1;

      beforeEach(() => {
        em = new EntityManager({
          entities: [TestingEntity1, TestingEntity2],
        });
      });

      describe("Foreign Keys", () => {
        beforeEach(() => {
          result = em.commit(TestingEntity1, {
            id: 1,
            entity2: 1,
          });
        });

        it("should return an instance", () => {
          expect(result).toBeInstanceOf(TestingEntity1);
        });

        it("should mark the entity as populated", () => {
          expect(result[POPULATED]).toBe(true);
        });

        it("should build the bilateral relations", () => {
          expect(result.entity2).toBeInstanceOf(TestingEntity2);
          expect(result.entity2.entity1).toBe(result);
        });

        it("should mark the relation entity as unpopulated", () => {
          expect(result.entity2[POPULATED]).toBe(false);
        });
      });

      describe("Nested Data", () => {
        beforeEach(() => {
          result = em.commit(TestingEntity1, {
            id: 1,
            entity2: {
              id: 1,
              entity1: 1,
            },
          });
        });

        it("should return an instance", () => {
          expect(result).toBeInstanceOf(TestingEntity1);
        });

        it("should mark the entity as populated", () => {
          expect(result[POPULATED]).toBe(true);
        });

        it("should build the bilateral relations", () => {
          expect(result.entity2).toBeInstanceOf(TestingEntity2);
          expect(result.entity2.entity1).toBe(result);
        });

        it("should mark the relation entity as populated", () => {
          expect(result.entity2[POPULATED]).toBe(true);
        });
      });
    });

    describe("Relations: Many", () => {
      @Entity()
      class TestingEntityParent extends BaseEntity<TestingEntityParent, "id"> {
        @Field({ primary: true })
        id!: number;

        @Field({
          relation: {
            target: () => TestingEntityChild,
            inverse: "parent",
            multi: true,
          },
        })
        children!: TestingEntityChild[];
      }

      @Entity()
      class TestingEntityChild extends BaseEntity<TestingEntityChild, "id"> {
        @Field({ primary: true })
        id!: number;

        @Field({
          relation: {
            target: () => TestingEntityParent,
            inverse: "children",
          },
        })
        parent!: TestingEntityParent;
      }

      beforeEach(() => {
        em = new EntityManager({
          entities: [TestingEntityChild, TestingEntityParent],
        });
      });

      describe("Foreign Keys", () => {
        describe("Parent", () => {
          let result: TestingEntityParent;

          beforeEach(() => {
            result = em.commit(TestingEntityParent, {
              id: 1,
              children: [1],
            });
          });

          it("should return an instance", () => {
            expect(result).toBeInstanceOf(TestingEntityParent);
          });

          it("should build the relations", () => {
            expect(result.children).toBeInstanceOf(Array);
            expect(result.children).toHaveLength(1);
            expect(result.children[0].parent).toBe(result);
          });
        });

        describe("Child", () => {
          let result: TestingEntityChild;

          beforeEach(() => {
            result = em.commit(TestingEntityChild, {
              id: 1,
              parent: 1,
            });
          });

          it("should return an instance", () => {
            expect(result).toBeInstanceOf(TestingEntityChild);
          });

          it("should build the relations", () => {
            expect(result.parent).toBeInstanceOf(TestingEntityParent);
            expect(result.parent.children).toBeInstanceOf(Array);
            expect(result.parent.children[0]).toBe(result);
          });
        });
      });

      describe("Nested Data", () => {
        describe("Parent", () => {
          let result: TestingEntityParent;

          beforeEach(() => {
            result = em.commit(TestingEntityParent, {
              id: 1,
              children: [{ id: 1 }],
            });
          });

          it("should return an instance", () => {
            expect(result).toBeInstanceOf(TestingEntityParent);
          });

          it("should build the relations", () => {
            expect(result.children).toBeInstanceOf(Array);
            expect(result.children[0]).toBeInstanceOf(TestingEntityChild);
            expect(result.children[0].parent).toBe(result);
          });
        });

        describe("Child", () => {
          let result: TestingEntityChild;

          beforeEach(() => {
            result = em.commit(TestingEntityChild, {
              id: 1,
              parent: { id: 1 },
            });
          });

          it("should return an instance", () => {
            expect(result).toBeInstanceOf(TestingEntityChild);
          });

          it("should build the relations", () => {
            expect(result.parent).toBeInstanceOf(TestingEntityParent);
            expect(result.parent.children).toBeInstanceOf(Array);
            expect(result.parent.children[0]).toBe(result);
          });
        });
      });
    });
  });

  describe(".retrieve()", () => {
    @Entity()
    class TestingEntity extends BaseEntity<TestingEntity, "id"> {
      @Field({ primary: true })
      id!: number;
    }

    let result: TestingEntity;

    beforeEach(() => {
      em = new EntityManager({
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
