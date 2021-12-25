# 实体事件

我们可以通过 `orm.eem` 监听实体事件。（`eem` 意为 `EntityEventManager`）

所有的事件监听器都将在调用 `orm.reset()` 后移除。

| 事件        | 时机                              |
| ----------- | --------------------------------- |
| `"resolve"` | 在使用 `orm.resolve()` 解析后调用 |
| `"update"`  | 在已解析且任何字段被赋值后调用    |

## 监听事件

我们可以使用 `orm.eem.on()` 或者 `orm.eem.once()` 来监听事件。触发事件的实体将被传递给事件监听器。

事件目标可以是：

- 一个特定的实体
- 一个特定实体类的实体
- 任何实体

```ts
orm.eem.on(book, "update", (book) => console.debug(book));
orm.eem.on(Book, "update", (book) => console.debug(book));
orm.eem.on("any", "update", (book) => console.debug(book));
```

## 移除事件监听器

我们可以移除：

- 一个特定事件目标的一个特定事件的一个特定事件监听器
- 一个特定事件目标的一个特定事件的所有事件监听器
- 一个特定事件目标的所有事件监听器
- 所有事件监听器

```ts
orm.eem.off(book, "update", callback);
orm.eem.off(Book, "update", callback);
orm.eem.off("any", "update", callback);

orm.eem.off(book, "update");
orm.eem.off(Book, "update");
orm.eem.off("any", "update");

orm.eem.off(book);
orm.eem.off(Book);
orm.eem.off("any");

orm.eem.off();
```
