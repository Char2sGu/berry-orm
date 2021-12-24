# Preparing the ORM

Having defined our entities, it is now time to put them to use.

```ts
export const orm = new BerryOrm({
  entities: [User, Department, Profile],
});
```

All the entities we want to use in this `BerryOrm` instance should be passed to the `entities` option.

Entity inspections will be performed during the instantiation of `BerryOrm` to ensure they can work properly.

- `@Entity()` must be applied to the entity classes.
- If one entity class is registered, all its relational entity classes must be registered as well.
- Entities cannot have duplicate class names.
