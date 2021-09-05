# Constructing BerryOrm

The `BerryOrm` instance is the top-level instance of Berry ORM.

```ts
// src/orm.ts
export const orm = new BerryOrm({
  entities: [User, Department, Profile],
});
```

If one type of entity has relations with other types of entities, the entity classes of these types of entities must be either **all** passed in or **all not** passed in.

This instance exposes several `Manager` instances on its properties, of which the most commonly used is the `EntityManager` instance exposed on `.em`.

::: tip
The constructor of `BerryOrm` will check whether the entity classes are all legal, to help you minimize bugs in the runtime of your application.
:::
