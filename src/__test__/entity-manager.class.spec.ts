import { BaseEntity, Entity, EntityManager, Field, POPULATED } from "..";
import { Collection } from "../collection.class";

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
      }

      beforeEach(() => {
        em = new EntityManager({ entities: [TestingEntity] });
      });

      let entity: TestingEntity;

      describe("Create", () => {
        beforeEach(() => {
          entity = em.populate(TestingEntity, {
            id: 1,
            field1: "",
          });
        });

        it("should return an instance", () => {
          expect(entity).toBeInstanceOf(TestingEntity);
        });

        it("should assign the values to the instance", () => {
          expect(entity.id).toBe(1);
          expect(entity.field1).toBe("");
        });
      });

      describe("Update", () => {
        beforeEach(() => {
          entity = em.populate(TestingEntity, {
            id: 1,
            field1: "",
          });
          em.populate(TestingEntity, {
            id: 1,
            field1: "updated",
          });
        });

        it("should update the values", () => {
          expect(entity.id).toBe(1);
          expect(entity.field1).toBe("updated");
        });
      });
    });

    describe("Relations: One", () => {
      @Entity()
      class TestingEntity1 extends BaseEntity<TestingEntity1, "id"> {
        @Field({ primary: true })
        id!: number;

        @Field({
          target: () => TestingEntity2,
          inverse: "entity1",
        })
        entity2!: TestingEntity2;
      }

      @Entity()
      class TestingEntity2 extends BaseEntity<TestingEntity2, "id"> {
        @Field({ primary: true })
        id!: number;

        @Field({
          target: () => TestingEntity1,
          inverse: "entity2",
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
        describe("Create", () => {
          beforeEach(() => {
            result = em.populate(TestingEntity1, {
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

        describe("Update", () => {
          describe("Change", () => {
            beforeEach(() => {
              result = em.populate(TestingEntity1, {
                id: 1,
                entity2: 1,
              });
              em.populate(TestingEntity1, {
                id: 1,
                entity2: 2,
              });
            });

            it("should construct the relation", () => {
              expect(result.entity2.id).toBe(2);
              expect(result.entity2.entity1).toBe(result);
            });

            it("should destruct the previous relation", () => {
              const previous = em.retrieve(TestingEntity2, 1);
              expect(previous.entity1).toBeUndefined();
            });
          });

          describe.each`
            value
            ${null}
            ${undefined}
          `("Remove: $value", ({ value }) => {
            beforeEach(() => {
              result = em.populate(TestingEntity1, { id: 1, entity2: 1 });
              em.populate(TestingEntity1, { id: 1, entity2: value });
            });

            it("should destruct the relation", () => {
              expect(result.entity2).toBeFalsy();
            });
          });
        });
      });

      describe("Nested Data", () => {
        describe("Create", () => {
          beforeEach(() => {
            result = em.populate(TestingEntity1, {
              id: 1,
              entity2: { id: 1 },
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

        describe("Update", () => {
          beforeEach(() => {
            result = em.populate(TestingEntity1, { id: 1, entity2: 1 });
            em.populate(TestingEntity1, { id: 1, entity2: 2 });
          });

          it("should construct the new relation", () => {
            expect(result.entity2.id).toBe(2);
            expect(result.entity2.entity1).toBe(result);
          });

          it("should destruct the previous relation", () => {
            const previous = em.retrieve(TestingEntity2, 1);
            expect(previous.entity1).toBeUndefined();
          });
        });
      });
    });

    describe("Relations: Many", () => {
      @Entity()
      class TestingEntityParent extends BaseEntity<TestingEntityParent, "id"> {
        @Field({ primary: true })
        id!: number;

        @Field({
          target: () => TestingEntityChild,
          inverse: "parent",
          multi: true,
        })
        children!: Collection<TestingEntityChild>;
      }

      @Entity()
      class TestingEntityChild extends BaseEntity<TestingEntityChild, "id"> {
        @Field({ primary: true })
        id!: number;

        @Field({
          target: () => TestingEntityParent,
          inverse: "children",
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

          describe("Create", () => {
            beforeEach(() => {
              result = em.populate(TestingEntityParent, {
                id: 1,
                children: [1],
              });
            });

            it("should return an instance", () => {
              expect(result).toBeInstanceOf(TestingEntityParent);
            });

            it("should build the relations", () => {
              expect(result.children).toBeInstanceOf(Collection);
              expect(result.children.size).toBe(1);
              expect([...result.children][0].parent).toBe(result);
            });
          });

          describe("Update", () => {
            beforeEach(() => {
              result = em.populate(TestingEntityParent, {
                id: 1,
                children: [1],
              });
              em.populate(TestingEntityParent, { id: 1, children: [2] });
            });

            it("should construct the relation", () => {
              expect(result.children.size).toBe(1);
              const child = [...result.children][0];
              expect(child.id).toBe(2);
              expect(child.parent).toBe(result);
            });

            it("should destruct the relation", () => {
              const previous = em.retrieve(TestingEntityChild, 1);
              expect(previous.parent).toBeUndefined();
            });
          });
        });

        describe("Child", () => {
          let result: TestingEntityChild;

          describe("Create", () => {
            beforeEach(() => {
              result = em.populate(TestingEntityChild, {
                id: 1,
                parent: 1,
              });
            });

            it("should return an instance", () => {
              expect(result).toBeInstanceOf(TestingEntityChild);
            });

            it("should build the relations", () => {
              expect(result.parent).toBeInstanceOf(TestingEntityParent);
              expect(result.parent.children).toBeInstanceOf(Collection);
              expect([...result.parent.children][0]).toBe(result);
            });
          });

          describe("Update", () => {
            beforeEach(() => {
              result = em.populate(TestingEntityChild, { id: 1, parent: 1 });
              em.populate(TestingEntityChild, { id: 1, parent: 2 });
            });

            it("should construct the relation", () => {
              expect(result.parent.id).toBe(2);
              expect([...result.parent.children][0]).toBe(result);
            });

            it("should destruct the previous relation", () => {
              const previous = em.retrieve(TestingEntityParent, 1);
              expect(previous.children.size).toBe(0);
            });
          });
        });
      });

      describe("Nested Data", () => {
        describe("Parent", () => {
          let result: TestingEntityParent;

          describe("Create", () => {
            beforeEach(() => {
              result = em.populate(TestingEntityParent, {
                id: 1,
                children: [{ id: 1 }],
              });
            });

            it("should return an instance", () => {
              expect(result).toBeInstanceOf(TestingEntityParent);
            });

            it("should build the relations", () => {
              expect(result.children).toBeInstanceOf(Collection);
              expect([...result.children][0]).toBeInstanceOf(
                TestingEntityChild,
              );
              expect([...result.children][0].parent).toBe(result);
            });
          });

          describe("Update", () => {
            beforeEach(() => {
              result = em.populate(TestingEntityParent, {
                id: 1,
                children: [{ id: 1 }],
              });
              em.populate(TestingEntityParent, {
                id: 1,
                children: [{ id: 2 }],
              });
            });

            it("should construct the relation", () => {
              const child = [...result.children][0];
              expect(child.id).toBe(2);
              expect(child.parent).toBe(result);
            });

            it("should destruct the previous relation", () => {
              const previous = em.retrieve(TestingEntityChild, 1);
              expect(previous.parent).toBeUndefined();
            });
          });
        });

        describe("Child", () => {
          let result: TestingEntityChild;

          describe("Create", () => {
            beforeEach(() => {
              result = em.populate(TestingEntityChild, {
                id: 1,
                parent: { id: 1 },
              });
            });

            it("should return an instance", () => {
              expect(result).toBeInstanceOf(TestingEntityChild);
            });

            it("should build the relations", () => {
              expect(result.parent).toBeInstanceOf(TestingEntityParent);
              expect(result.parent.children).toBeInstanceOf(Collection);
              expect([...result.parent.children][0]).toBe(result);
            });
          });

          describe("Update", () => {
            beforeEach(() => {
              result = em.populate(TestingEntityChild, { id: 1, parent: 1 });
              em.populate(TestingEntityChild, { id: 1, parent: 2 });
            });

            it("should construct the relation", () => {
              expect(result.parent.id).toBe(2);
              expect([...result.parent.children][0]).toBe(result);
            });

            it("should destruct the relation", () => {
              const previous = em.retrieve(TestingEntityParent, 1);
              expect(previous.children.size).toBe(0);
            });
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

      @Field({
        target: () => TestingEntity,
        inverse: "relations",
        multi: true,
      })
      relations!: Collection<TestingEntity>;
    }

    let result: TestingEntity;

    beforeEach(() => {
      em = new EntityManager({
        entities: [TestingEntity],
      });
    });

    describe("Not Exists", () => {
      beforeEach(() => {
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

      it("should initialize collection fields", () => {
        expect(result.relations).toBeDefined();
        expect(result.relations).toBeInstanceOf(Collection);
      });

      it("should forbid updating collection fields", () => {
        expect(() => {
          result.relations = Object.create(Collection.prototype);
        }).toThrowError();
      });

      it("should forbid updating the priamry key field", () => {
        expect(() => {
          result.id = 2;
        }).toThrowError();
      });
    });

    describe("Exists", () => {
      let entity: TestingEntity;
      beforeEach(() => {
        entity = em.populate(TestingEntity, { id: 1 });
        result = em.retrieve(TestingEntity, 1);
      });

      it("should return the existed entity", () => {
        expect(result).toBe(entity);
      });
    });
  });
});
