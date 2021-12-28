# Identity Map

There is an `IdentityMap` instance belonging to each `BerryOrm` instance, which is accessible through `orm.map`.

The `IdentityMap` instance stores every accessed entities. When an entity is needed, Berry ORM calls `orm.map.get()` internally to get or instantiate the entity. Therefore, `Book` entities with a same primary key is always the same object and can be compared directly.

```ts
book1.id; // 1
book2.id; // 2
book1 == book2; // true
```

## Clearing the Identity Map

Sometimes we don't want previous entities to be accessible, for example, when a user logs out of a web application.

We can clear the `IdentityMap` instance and make previous entities inaccessible through `orm.reset()`. After invoking `orm.reset()`, a `FieldAccessDeniedError` will be thrown if previous entities are accessed, because the previous entities should not be referenced and should be cleared by GC.

```ts
const bookOld = orm.em.resolve(Book, { id: 1 });
orm.reset();
bookOld.id; // FieldAccessDeniedError
```

::: tip

The `IdentityMap` instance can be also cleared using `orm.map.clear()`, which is not recommended because the previous entities will still be accessible so there will be potential issues.

:::

## Scoped Identity Maps

We may hope to have a clean `IdentityMap` instance in some scopes, for example a request scoped one.

We can achieve that by invoking `orm.fork()` to create a new `BerryOrm` instance from the original one with a same entity registry and new child instances including a clean `IdentityMap` instance.

```ts
const orm = new BerryOrm({ entities: [Book] });
const ormChild = orm.fork();
orm.registry == ormChild.registry; // true
orm.map == ormChild.map; // false
```

We can access the parent of a `BerryOrm` instance through its `.parent` property.

```ts
orm.parent; // undefined
ormChild.parent; // orm
```

## Version of ORMs and Entities

Every `BerryOrm` instance have an auto-incremental number as its version, which is incremented during instantiation or invoking `orm.reset()` or `orm.fork()`。

```ts
const orm1 = new BerryOrm({ entities: [] });
const orm2 = new BerryOrm({ entities: [] });
orm1.version; // 1
orm2.version; // 2

orm2.reset();
orm2.version; // 3

const orm3 = orm2.fork();
orm3.version; // 4
```

When an entity is instantiated, its ORM instance's current version will be stored to its `[VERSION]` property, which can be used to identity entities from different `IdentityMap` instances.

```ts
const orm = new BerryOrm({ entities: [Book] });
const book1 = orm.resolve(Book, { id: 1 });
orm.reset();
const book2 = orm.resolve(Book, { id: 1 });

book1 == book2; // false because they are from different `IdentityMap`s
book1[VERSION]; // 1
book2[VERSION]; // 2
```

::: tip

`VERSION` is a `symbol`.

:::
