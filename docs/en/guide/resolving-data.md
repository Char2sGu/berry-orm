# Resolving Data

`orm.em.resolve()` converts a _plain data object_ into an _entity_. (`em` means `EntityManager`)

Of course, `orm.em.resolve()` is also strictly typed to restrict the type of the plain data object passed.

## Basic Resolving

The primary key and all the common fields' values must be specified in the plain data object, while relations can be optional.

For the primary field and common fields, their values in entities are simply copied from the plain data object.

```ts
const book = orm.em.resolve(Book, {
  id: 1,
  name: "Book",
});
```

```ts
book instanceof Book; // true
book.id == 1; // true
book.name == "Book"; // true
```

## Duplicated Resolving

There is an `IdentityMap` for each `BerryOrm` instance storing every accessed entities. Therefore, when another plain data object is resolved with a existing primary key, the existing entity will be updated and returned.

```ts
const bookNew = orm.em.resolve(Book, {
  id: 1,
  name: "New Name",
});
```

```ts
bookOld == bookNew; // true
bookOld.name == "New Name"; // true
```

## Relational Resolving

For relation fields , their values can be represented using both primary keys or nested plain data objects.

### Constructing Relations

```ts {4}
const book = orm.em.resolve(Book, {
  id: 1,
  name: "Book",
  author: { id: 1, name: "Char2s" },
});

const author = orm.em.resolve(Author, {
  id: 1,
  name: "Char2s",
});
```

Bilateral relations will be constructed when relational data are resolved, which means that although `author.books` was not specified in its plain data object, the `book` was added to `author.books` automatically, and vice versa.

```ts
book.author == author; // true
author.books.has(book); // true
```

We can also use primary keys to represent relations, but note that the target entities will be [skeleton entities](#skeleton-entities) if they have not been resolved before, about which we will talk later.

### Updating Relations

In a [duplicated resolving](#duplicated-resolving), old relations will be destructed and then new relations will be constructed.

### Destructing Relations

Relations will be destructed when an `undefined` is specified as the value of relation fields representing _OneToOne_ or _ManyToOne_ relations, or an array with some relations removed as the value of relation fields representing _OneToMany_ or _ManyToMany_ relations.

```ts
orm.em.resolve(Book, {
  id: 1,
  name: "Book",
  author: undefined,
});

// or

orm.em.resolve(Author, {
  id: 1,
  name: "Char2s",
  books: [],
});
```

::: tip

This approach is not being used to destruct relations intentionally. See [Accessing Fields](./accessing-fields.html#relation-fields) for more information.

:::

## Skeleton Entities

We can use primary keys to represent the value of relation fields in plain data objects.

```ts {4}
const book = orm.em.resolve(Book, {
  id: 1,
  name: "Book",
  author: 1,
});
```

`book.author` here is a _skeleton entity_ because `Author` with `id: 1` is never resolved before, which means that we can only ensure that its primary key is known and most of its common fields and relation fields will probably be `undefined`.

```ts
book.author.id == 1; // true
book.author.books.has(book); // true
book.author.name === undefined; // true
```

We can recognize skeleton entities through the `[RESOLVED]` property.

```ts
book[RESOLVED]; // true
book.author[RESOLVED]; // false
```

::: tip

`RESOLVED` is a `symbol`.

:::
