import { BaseEntity, Entity, EntityManager, Field } from "..";
import { EntityData } from "../entity-data.type";

describe("EntityManager", () => {
  describe(".transform()", () => {
    @Entity()
    class User extends BaseEntity<User, "id"> {
      @Field({ primary: true })
      id!: number;

      @Field()
      username!: string;
    }

    let data: EntityData<User>;
    let entity: User;

    beforeEach(() => {
      data = { id: 1, username: "s" };
      const em = new EntityManager({ entities: [User] });
      entity = em.transform(User, data);
    });

    it("should transform the data into an entity", () => {
      expect(entity).toBeInstanceOf(User);
    });

    it("should assign the data to the entity", () => {
      expect(entity.id).toBe(data.id);
      expect(entity.username).toBe(data.username);
    });
  });
});
