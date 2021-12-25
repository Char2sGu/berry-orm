# 解析数据

`orm.em.resolve()`将一个*普通数据对象*转换为一个*实体*。（`em` 意为 `EntityManager`）

当然，`orm.em.resolve()` 也是严格类型化的，以限制传递的普通数据对象的类型。

## 基本解析

主键和所有普通字段的值必须在普通数据对象中指定，而关系字段的值是可选的。

对于主字段和公共字段，它们在实体中的值只是简单地从普通数据对象中复制而来。

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

## 重复解析

每个 `BerryOrm` 实例都有一个 `IdentityMap` 用以存储每个访问过的实体。因此，当另一个具有已知主键的普通数据对象被解析时，现有的实体将被更新并返回。

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

## 关系解析

对于关系字段，它们的值可以用主键或嵌套的普通数据对象来表示。

### 构建关系

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

双向的关系将在关系数据解析后构建，这意味着尽管 `author.books` 没有在其普通数据对象中指定，`book` 仍然被自动地添加进了 `author.books` 中，反之亦然。

```ts
book.author == author; // true
author.books.has(book); // true
```

我们也可以使用主键来表示关系，但要注意的是，如果目标实体在之前没有被解析过，那么它们将成为[骨架实体](#skeleton-entities)，关于这一点我们将在后面讲到。

### 更新关系

在[重复解析](#duplicated-resolving)中，旧的关系将被破坏，然后新的关系将被构建。

### 破坏关系

当一个 `undefined` 被指定为代表 _一对一_ 或 _多对一_ 关系字段的值时，或者一个移除了某些关系的数组被指定为代表 _一对多_ 或 _多对多_ 关系字段的值时，关系将被破坏。

```ts
orm.em.resolve(Book, {
  id: 1,
  name: "Book",
  author: undefined,
});

// 或者

orm.em.resolve(Author, {
  id: 1,
  name: "Char2s",
  books: [],
});
```

::: tip

这种方法不适合用来有目的地破坏关系。详见 [访问字段](./accessing-fields.html#relation-fields)。

:::

## 骨架实体

我们可以使用主键来表示普通数据对象中关系字段的值。

```ts {4}
const book = orm.em.resolve(Book, {
  id: 1,
  name: "Book",
  author: 1,
});
```

这里的 `book.author` 是一个 _骨架实体_，因为 `id: 1` 的 `Author` 此前还没有被解析过，这意味着我们只能确保它的主键是已知的，它的大部分普通字段和关系字段可能都是 `undefined`。

```ts
book.author.id == 1; // true
book.author.books.has(book); // true
book.author.name === undefined; // true
```

我们可以通过 `[RESOLVED]` 属性来识别骨架实体。

```ts
book[RESOLVED]; // true
book.author[RESOLVED]; // false
```

::: tip

`RESOLVED` 是一个 `symbol`。

:::
