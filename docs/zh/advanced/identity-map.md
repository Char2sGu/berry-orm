# Identity Map

在每一个 `BerryOrm` 的实例中都有一个 `IdentityMap` 实例，可以通过 `orm.map` 来访问。

该 `IdentityMap` 实例保存每一个访问过的实体。当需要某一实体时，Berry ORM 在内部调用 `orm.map.get()` 来获取或实例化该实体。因此，具有相同主键的 `Book` 实体总是同一个对象，可以直接用来比较。

```ts
book1.id; // 1
book2.id; // 2
book1 == book2; // true
```

## 清除 Identity Map

有时，我们不想要先前的实体被访问到。例如，当一个用户登出了一个 Web 应用。

我们可以通过 `orm.reset()` 来清除 `IdentityMap` 实例并使先前的实体不可访问。在调用 `orm.reset()` 后，如果访问先前的实体，将会抛出一个 `FieldAccessDeniedError`，因为先前的实体不应该再被引用且应该被 GC 清理掉。

```ts
const bookOld = orm.em.resolve(Book, { id: 1 });
orm.reset();
bookOld.id; // FieldAccessDeniedError
```

::: tip

`IdentityMap` 实例也可以通过 `orm.map.clear()` 来清除。这是不被推荐的，因为先前的实体将仍然可以访问，因此可能存在潜在的问题。

:::

## 范围 Identity Map

我们可能希望在某些范围内拥有一个干净的 `IdentityMap` 实例，例如请求范围的 `IdentityMap` 实例。

我们可以通过调用 `orm.fork()` 来从原先的 `BerryOrm` 实例创建一个新的 `BerryOrm` 实例，它具有相同的实体注册和新的子实例，包括一个干净的 `IdentityMap` 实例。

```ts
const orm = new BerryOrm({ entities: [Book] });
const ormChild = orm.fork();
orm.registry == ormChild.registry; // true
orm.map == ormChild.map; // false
```

我们可以通过其 `.parent` 属性来访问一个 `BerryOrm` 实例的父实例。

```ts
orm.parent; // undefined
ormChild.parent; // orm
```

## ORM 与实体的版本

每个 `BerryOrm` 实例都拥有一个自动递增的数字作为它的版本，该数字在实例化或调用 `orm.reset()` 或 调用 `orm.fork()` 时递增。

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

当一个实体被实例化时，其 ORM 的当前版本将被保存到其 `[VERSION]` 属性，该版本可以用来辨别来自不同 `IdentityMap` 实例的实体。

```ts
const orm = new BerryOrm({ entities: [Book] });
const book1 = orm.resolve(Book, { id: 1 });
orm.reset();
const book2 = ormChild.resolve(Book, { id: 1 });

book1 == book2; // false，因为它们来自不同的 `IdentityMap` 实例
book1[VERSION]; // 1
book2[VERSION]; // 2
```

::: tip

`VERSION` 是一个 `symbol`.

:::
