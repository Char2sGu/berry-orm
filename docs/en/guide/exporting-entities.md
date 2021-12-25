# Exporting Entities

Entities can also be converted back to plain data object through `orm.em.export()`.

## Basic

The primary key and common fields' values will be directly copied from the entity, and relations will be represented using primary keys by default.

```ts
const book = orm.em.resolve(Book, {
  id: 1,
  name: "Book",
  author: { id: 1, name: "Char2s" },
});

const data = orm.em.export(book);
data.id; // 'id'
data.name; // "Book"
data.author; // 1
```

## Expansions

Relations are represented using primary keys in exported objects by default, while we can specify which relations to be expanded into nested objects through the second parameter `expansions`.

```ts
const data = orm.em.export(user, {
  profile: true,
  friends: { profile: true },
});
```

```ts
typeof data.profile; // "object"
data.friends.forEach((friend) => {
  typeof friend; // "object"
  typeof friend.profile; // "object"
});
```

::: tip

`orm.em.export()` has been strictly typed.

- The return type will be generated dynamically.
- There will be a type error if invalid value is passed to `expansions`, although auto-completion is not supported because of TypeScript's limitations.

![](../../../res/exporting-entities.gif)

:::

::: warning

Relations specified in `expansions` cannot have [skeleton entities](./resolving-data.html#skeleton-entities), otherwise an error will be thrown.

:::
