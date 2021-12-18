import { BerryOrm } from "../../berry-orm.class";
import { Collection } from "../../field/field-values/collection.class";
import { Entity } from "../../meta/entity.decorator";
import { Field } from "../../meta/field.decorator";
import { Primary } from "../../meta/primary.decorator";
import { Relation } from "../../meta/relation.decorator";
import { DateSerializer } from "../../serializer/date.serializer";
import { POPULATED } from "../../symbols";
import { BaseEntity } from "../base-entity.class";
import { EntityData } from "../entity-data.type";
import { EntityType } from "../entity-type.type";

describe("EntityManager", () => {
  let orm: BerryOrm;

  describe(".populate()", () => {
    describe("Scalars", () => {
      @Entity()
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        @Primary()
        @Field()
        id!: number;

        @Field()
        field1!: Date;
      }

      beforeEach(() => {
        prepare([TestingEntity]);
      });

      let entity: TestingEntity;

      it.each`
        populate
        ${() => orm.em.populate(TestingEntity, { id: 1, field1: new Date() })}
        ${() => orm.em.populate(TestingEntity, { id: 1, field1: new Date().toISOString() }, { field1: DateSerializer })}
      `("should populate the fields", ({ populate }) => {
        entity = populate();
        expect(entity.id).toBe(1);
        expect(entity.field1).toBeInstanceOf(Date);
        expect(entity.field1).not.toBeNaN();
      });
    });

    describe("Relations: One", () => {
      @Entity()
      class TestingEntity1 extends BaseEntity<TestingEntity1, "id"> {
        @Primary()
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
        prepare([TestingEntity1, TestingEntity2]);
      });

      describe("Foreign Keys", () => {
        describe("Create", () => {
          beforeEach(() => {
            result = orm.em.populate(TestingEntity1, {
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
              result = orm.em.populate(TestingEntity1, {
                id: 1,
                entity2: 1,
              });
              orm.em.populate(TestingEntity1, {
                id: 1,
                entity2: 2,
              });
            });

            it("should construct the relation", () => {
              expect(result.entity2.id).toBe(2);
              expect(result.entity2.entity1).toBe(result);
            });

            it("should destruct the previous relation", () => {
              const previous = orm.imm.get(TestingEntity2).get(1);
              expect(previous.entity1).toBeUndefined();
            });
          });

          describe.each`
            value
            ${null}
            ${undefined}
          `("Remove: $value", ({ value }) => {
            beforeEach(() => {
              result = orm.em.populate(TestingEntity1, {
                id: 1,
                entity2: 1,
              });
              orm.em.populate(TestingEntity1, { id: 1, entity2: value });
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
            result = orm.em.populate(TestingEntity1, {
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
            result = orm.em.populate(TestingEntity1, {
              id: 1,
              entity2: 1,
            });
            orm.em.populate(TestingEntity1, { id: 1, entity2: 2 });
          });

          it("should construct the new relation", () => {
            expect(result.entity2.id).toBe(2);
            expect(result.entity2.entity1).toBe(result);
          });

          it("should destruct the previous relation", () => {
            const previous = orm.imm.get(TestingEntity2).get(1);
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
        prepare([TestingEntityChild, TestingEntityParent]);
      });

      describe("Foreign Keys", () => {
        describe("Parent", () => {
          let result: TestingEntityParent;

          describe("Create", () => {
            beforeEach(() => {
              result = orm.em.populate(TestingEntityParent, {
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
              result = orm.em.populate(TestingEntityParent, {
                id: 1,
                children: [1],
              });
              orm.em.populate(TestingEntityParent, {
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
              const previous = orm.imm.get(TestingEntityChild).get(1);
              expect(previous.parent).toBeUndefined();
            });
          });
        });

        describe("Child", () => {
          let result: TestingEntityChild;

          describe("Create", () => {
            beforeEach(() => {
              result = orm.em.populate(TestingEntityChild, {
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
              result = orm.em.populate(TestingEntityChild, {
                id: 1,
                parent: 1,
              });
              orm.em.populate(TestingEntityChild, { id: 1, parent: 2 });
            });

            it("should construct the relation", () => {
              expect(result.parent.id).toBe(2);
              expect([...result.parent.children][0]).toBe(result);
            });

            it("should destruct the previous relation", () => {
              const previous = orm.imm.get(TestingEntityParent).get(1);
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
              result = orm.em.populate(TestingEntityParent, {
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
              result = orm.em.populate(TestingEntityParent, {
                id: 1,
                children: [{ id: 1 }],
              });
              orm.em.populate(TestingEntityParent, {
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
              const previous = orm.imm.get(TestingEntityChild).get(1);
              expect(previous.parent).toBeUndefined();
            });
          });
        });

        describe("Child", () => {
          let result: TestingEntityChild;

          describe("Create", () => {
            beforeEach(() => {
              result = orm.em.populate(TestingEntityChild, {
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
              result = orm.em.populate(TestingEntityChild, {
                id: 1,
                parent: 1,
              });
              orm.em.populate(TestingEntityChild, { id: 1, parent: 2 });
            });

            it("should construct the relation", () => {
              expect(result.parent.id).toBe(2);
              expect([...result.parent.children][0]).toBe(result);
            });

            it("should destruct the relation", () => {
              const previous = orm.imm.get(TestingEntityParent).get(1);
              expect(previous.children.size).toBe(0);
            });
          });
        });
      });
    });
  });

  describe(".export()", () => {
    it("should return an object equal to the data when there are only scalars in the entity", () => {
      @Entity()
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        @Primary() @Field() id!: number;
        @Field() field!: string;
      }
      prepare([TestingEntity]);
      const originalData: EntityData<TestingEntity> = { id: 1, field: "a" };
      const entity = orm.em.populate(TestingEntity, originalData);
      const exportedData = orm.em.export(entity);
      expect(exportedData).toEqual(originalData);
    });

    it("should apply the serializers when serialziers are specified", () => {
      @Entity()
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        @Primary() @Field() id!: number;
        @Field() date!: Date;
      }
      prepare([TestingEntity]);
      const date = new Date();
      const entity = orm.em.populate(TestingEntity, { id: 1, date });
      const data = orm.em.export(entity, undefined, {
        date: DateSerializer,
      });
      expect(typeof data.date == "string").toBe(true);
      expect(data.date).toBe(date.toISOString());
    });

    it("should expand the relations when expansions are specified as a to-one field", () => {
      @Entity()
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        @Primary() @Field() id!: number;
        @Relation({ target: () => TestingEntity, inverse: "field" })
        @Field()
        field!: TestingEntity;
      }
      prepare([TestingEntity]);
      const entity = orm.em.populate(TestingEntity, {
        id: 1,
        field: { id: 2 },
      });
      const data = orm.em.export(entity, { field: true }, undefined);
      expect(typeof data.field == "object").toBe(true);
    });

    it("should expand the relations when expansions are specified as a to-many field", () => {
      @Entity()
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        @Primary() @Field() id!: number;
        @Relation({
          target: () => TestingEntity,
          inverse: "field",
          multi: true,
        })
        @Field()
        field!: Collection<TestingEntity>;
      }
      prepare([TestingEntity]);
      const entity = orm.em.populate(TestingEntity, {
        id: 1,
        field: [{ id: 2 }],
      });
      const data = orm.em.export(entity, { field: true }, undefined);
      expect(data.field).toBeInstanceOf(Array);
      expect(data.field[0].id).toBe(2);
    });

    it("should apply the nested serializers when the specified serializers are nested", () => {
      @Entity()
      class TestingEntity extends BaseEntity<TestingEntity, "id"> {
        @Primary() @Field() id!: number;
        @Relation({ target: () => TestingEntity, inverse: "field1" })
        @Field()
        field1!: TestingEntity;
        @Field()
        field2!: Date;
      }
      prepare([TestingEntity]);
      const entity = orm.em.populate(TestingEntity, {
        id: 1,
        field2: new Date(),
        field1: { id: 2, field2: new Date() },
      });
      const data = orm.em.export(
        entity,
        { field1: true },
        { field1: { field2: DateSerializer } },
      );
      expect(typeof data.field1 == "object").toBe(true);
      expect(data.field2).toBeInstanceOf(Date);
      expect(typeof data.field1.field2 == "string").toBe(true);
    });
  });

  function prepare(entities: EntityType[]) {
    orm = BerryOrm.create({ entities });
  }
});
