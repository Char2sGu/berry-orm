# Constructing BerryOrm

The `BerryOrm` instance is the top-level instance of Berry ORM.

To construct this instance, you need to pass in all the **entity classes** used. If one type of entity has relations with other types of entities, the entity classes of these types of entities must be either **all** passed in or **all not** passed in.

```ts
// src/orm.ts
export const orm = new BerryOrm({
  entities: [User, Department, Profile],
});
```

There is an `EntityManager` instance provided at the `.em` property of the `BerryOrm` instance. In your application, most operations on entities will be done by the `EntityManager` instance.

::: tip
In the process of constructing the `BerryOrm` instance, the entity classes passed in will be inspected to help you minimize the possibility of runtime errors.
:::
