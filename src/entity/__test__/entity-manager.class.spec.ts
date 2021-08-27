import { Collection } from "../../field/collection.class";
import { Entity } from "../../meta/entity.decorator";
import { Field } from "../../meta/field.decorator";
import { Primary } from "../../meta/primary.decorator";
import { Relation } from "../../meta/relation.decorator";
import { POPULATED } from "../../symbols";
import { BaseEntity } from "../base-entity.class";
import { EntityManager } from "../entity-manager.class";
import { EntityRelationManager } from "../entity-relation-manager.class";
import { IdentityMapManager } from "../identity-map-manager.class";

describe("EntityManager", () => {
  let relationManager: EntityRelationManager;
  let identityMapManager: IdentityMapManager;
  let entityManager: EntityManager;

  beforeEach(() => {
    relationManager = new EntityRelationManager();
  });

  describe(".commit()", () => {
    describe("Values", () => {
      @Entity()
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        @Primary()
        @Field()
        id!: number;

        @Field()
        field1!: string;
      }

      beforeEach(() => {
        identityMapManager = new IdentityMapManager(
          new Set([TestingEntity]),
          relationManager,
        );
        entityManager = new EntityManager(identityMapManager, relationManager);
      });

      let entity: TestingEntity;

      describe("Create", () => {
        beforeEach(() => {
          entity = entityManager.populate(TestingEntity, {
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
          entity = entityManager.populate(TestingEntity, {
            id: 1,
            field1: "",
          });
          entityManager.populate(TestingEntity, {
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
        @Field()
        id!: number;

        @Relation({
          target: () => TestingEntity2,
          inverse: "entity1",
        })
        @Field()
        entity2!: TestingEntity2;
      }

      @Entity()
      class TestingEntity2 extends BaseEntity<TestingEntity2, "id"> {
        @Primary()
        @Field()
        id!: number;

        @Relation({
          target: () => TestingEntity1,
          inverse: "entity2",
        })
        @Field()
        entity1!: TestingEntity1;
      }

      let result: TestingEntity1;

      beforeEach(() => {
        identityMapManager = new IdentityMapManager(
          new Set([TestingEntity1, TestingEntity2]),
          relationManager,
        );
        entityManager = new EntityManager(identityMapManager, relationManager);
      });

      describe("Foreign Keys", () => {
        describe("Create", () => {
          beforeEach(() => {
            result = entityManager.populate(TestingEntity1, {
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
              result = entityManager.populate(TestingEntity1, {
                id: 1,
                entity2: 1,
              });
              entityManager.populate(TestingEntity1, {
                id: 1,
                entity2: 2,
              });
            });

            it("should construct the relation", () => {
              expect(result.entity2.id).toBe(2);
              expect(result.entity2.entity1).toBe(result);
            });

            it("should destruct the previous relation", () => {
              const previous = identityMapManager.get(TestingEntity2).get(1);
              expect(previous.entity1).toBeUndefined();
            });
          });

          describe.each`
            value
            ${null}
            ${undefined}
          `("Remove: $value", ({ value }) => {
            beforeEach(() => {
              result = entityManager.populate(TestingEntity1, {
                id: 1,
                entity2: 1,
              });
              entityManager.populate(TestingEntity1, { id: 1, entity2: value });
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
            result = entityManager.populate(TestingEntity1, {
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
            result = entityManager.populate(TestingEntity1, {
              id: 1,
              entity2: 1,
            });
            entityManager.populate(TestingEntity1, { id: 1, entity2: 2 });
          });

          it("should construct the new relation", () => {
            expect(result.entity2.id).toBe(2);
            expect(result.entity2.entity1).toBe(result);
          });

          it("should destruct the previous relation", () => {
            const previous = identityMapManager.get(TestingEntity2).get(1);
            expect(previous.entity1).toBeUndefined();
          });
        });
      });
    });

    describe("Relations: Many", () => {
      @Entity()
      class TestingEntityParent extends BaseEntity<TestingEntityParent, "id"> {
        @Primary()
        @Field()
        id!: number;

        @Relation({
          target: () => TestingEntityChild,
          inverse: "parent",
          multi: true,
        })
        @Field()
        children!: Collection<TestingEntityChild>;
      }

      @Entity()
      class TestingEntityChild extends BaseEntity<TestingEntityChild, "id"> {
        @Primary()
        @Field()
        id!: number;

        @Relation({
          target: () => TestingEntityParent,
          inverse: "children",
        })
        @Field()
        parent!: TestingEntityParent;
      }

      beforeEach(() => {
        identityMapManager = new IdentityMapManager(
          new Set([TestingEntityChild, TestingEntityParent]),
          relationManager,
        );
        entityManager = new EntityManager(identityMapManager, relationManager);
      });

      describe("Foreign Keys", () => {
        describe("Parent", () => {
          let result: TestingEntityParent;

          describe("Create", () => {
            beforeEach(() => {
              result = entityManager.populate(TestingEntityParent, {
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
              result = entityManager.populate(TestingEntityParent, {
                id: 1,
                children: [1],
              });
              entityManager.populate(TestingEntityParent, {
                id: 1,
                children: [2],
              });
            });

            it("should construct the relation", () => {
              expect(result.children.size).toBe(1);
              const child = [...result.children][0];
              expect(child.id).toBe(2);
              expect(child.parent).toBe(result);
            });

            it("should destruct the relation", () => {
              const previous = identityMapManager
                .get(TestingEntityChild)
                .get(1);
              expect(previous.parent).toBeUndefined();
            });
          });
        });

        describe("Child", () => {
          let result: TestingEntityChild;

          describe("Create", () => {
            beforeEach(() => {
              result = entityManager.populate(TestingEntityChild, {
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
              result = entityManager.populate(TestingEntityChild, {
                id: 1,
                parent: 1,
              });
              entityManager.populate(TestingEntityChild, { id: 1, parent: 2 });
            });

            it("should construct the relation", () => {
              expect(result.parent.id).toBe(2);
              expect([...result.parent.children][0]).toBe(result);
            });

            it("should destruct the previous relation", () => {
              const previous = identityMapManager
                .get(TestingEntityParent)
                .get(1);
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
              result = entityManager.populate(TestingEntityParent, {
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
              result = entityManager.populate(TestingEntityParent, {
                id: 1,
                children: [{ id: 1 }],
              });
              entityManager.populate(TestingEntityParent, {
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
              const previous = identityMapManager
                .get(TestingEntityChild)
                .get(1);
              expect(previous.parent).toBeUndefined();
            });
          });
        });

        describe("Child", () => {
          let result: TestingEntityChild;

          describe("Create", () => {
            beforeEach(() => {
              result = entityManager.populate(TestingEntityChild, {
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
              result = entityManager.populate(TestingEntityChild, {
                id: 1,
                parent: 1,
              });
              entityManager.populate(TestingEntityChild, { id: 1, parent: 2 });
            });

            it("should construct the relation", () => {
              expect(result.parent.id).toBe(2);
              expect([...result.parent.children][0]).toBe(result);
            });

            it("should destruct the relation", () => {
              const previous = identityMapManager
                .get(TestingEntityParent)
                .get(1);
              expect(previous.children.size).toBe(0);
            });
          });
        });
      });
    });
  });
});
