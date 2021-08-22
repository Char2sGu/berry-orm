# 为什么前端需要 ORM

从后端获取的数据中，对象间的关系通常使用主键来表示，这就导致获取关系对象容易变得繁琐。

譬如，这是请求 `/users/1/` 返回的数据：

```json {4}
{
  "id": 1,
  "username": "Charles",
  "profile": 1
}
```

这是请求 `/profiles/1/` 返回的数据：

```json {3}
{
  "id": 1,
  "owner": 1,
  "nickname": "Charlie"
}
```

此时， `user.profile` 仅仅是目标 `Profile` 的主键，而 `profile.owner` 也仅仅是目标 `User` 的主键，要访问实际的关系对象，我们还需要进行额外的操作。

::: tip

这个额外的操作可能会是这样的：

```ts
const profile = store.profiles[user.profile];
```

:::

当然，后端也可以将 `user.profile` 作为嵌套的数据对象来发送：

```json
{
  "id": 1,
  "username": "Charles",
  "profile": {
    "id": 1,
    "owner": 1,
    "nickname": "Charlie"
  }
}
```

那么此时 `user.profile` 就是一个对象了：

```ts
const profile = user.profile;
```

但 `user.profile.owner` 依然还是主键，你不能通过 `profile.owner` 反过来获取 `User`。

**但是如果使用了 ORM 呢？**

ORM 会建立**双向**的关系，于是你可以：

```ts
const profile = user.profile.owner.profile.owner.profile.owner.profile;
```

这还仅仅是 Berry ORM 的一部分功能，请继续阅读以探索 Berry ORM 的更多用途。
