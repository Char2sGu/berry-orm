# 使用 EntityManager

## 填充实体

**解析数据并对相应实体的字段进行赋值**的过程称为**填充**。**填充**是 Berry ORM 最核心的功能。

### 填充主键和数据

**填充**所用的数据必须指定该实体**主键字段**和所有**数据字段**的值。

```ts
const user = orm.em.populate(User, {
  id: 1,
  username: "Charles",
});
```

```ts
user instanceof User; // true
user.id == 1; // true
user.username == "Charles"; // true
```

### 填充关系

如果提供了实体的**关系字段**的值，Berry ORM 会解析这些值并在双方相应的字段上建立关系。

::: tip
任何**关系字段**在数据中都是可选的。
:::

#### 填充对单关系字段

**对单关系字段**在数据中的表现形式既可以是一个**主键**：

```ts {4}
const user = orm.em.populate(User, {
  id: 1,
  username: "Charles",
  profile: 1,
});
```

也可以是一个嵌套的**数据对象**：

```ts {4}
const user = orm.em.populate(User, {
  id: 1,
  username: "Charles",
  profile: { id: 1, nickname: "王大锤" },
});
```

::: warning
如果在嵌套数据对象中指定了对于父级数据对象的逆向关系，请务必保证它们不冲突，否则可能导致错误的关系被建立。

以下是一个错误示例：

```ts {2,7}
const user = orm.em.populate(User, {
  id: 1,
  username: "Charles",
  profile: {
    id: 1,
    nickname: "王大锤",
    owner: 2,
  },
});
```

在这个例子中，`user.profile`是属于`user`的，但是`user.profile.owner`却指定其属于另一个`User`，关系冲突了。正确的做法是将`user.profile.owner`指定为符合现有关系的值，如：`1`；更好的做法是直接在数据中忽略`user.profile.owner`，因为两者间的关系已经确定了，无需重复指定。

:::

Berry ORM 会建立**双向**的关系，这意味着你可以从关系的任意一侧访问另一侧：

```ts {3}
user.profile instanceof Profile; // true
user.profile.id == 1; // true
user.profile.owner == user; // true
```

这也意味着如果你愿意，你可以这样访问：  
XD

```ts {1}
user.profile.owner.profile.owner.profile.owner.profile.owner.profile.nickname; // 王大锤
```

#### 填充对多关系字段

**对多关系字段**在数据中的表现形式是一个 _值为**主键**或**嵌套数据对象**_ 的数组：

```ts {4}
const department = orm.em.populate(Department, {
  id: 1,
  name: "XXXXXX",
  members: [1, 2, { id: 3, username: "XDXDXDXD" }],
});
```

::: warning
同样的，如果在嵌套数据对象中指定了对于父级数据对象的逆向关系，请务必保证它们不会冲突。
:::

Berry ORM 同样会为它们建立**双向**的关系：

```ts
department.members.forEach((user) => {
  user.department == department; // true
});
```

## 实体的填充状态

你可能注意到了，即使我们在数据中为**关系字段**指定的主键所代表的实体还未知：

```ts {4}
const user = orm.em.populate(User, {
  id: 1,
  username: "Charles",
  profile: 999999,
});
```

以下表达式依然成立：

```ts
user.profile instanceof Profile;
user.profile.id == 999999; // true
user.profile.owner == user; // true
```

但是如果我们仔细观察`user.profile`，就会发现它任何其他字段的值都是空的（值为`undefined`或一个空的`Collection`）：

```ts
user.profile.bio === undefined; // true
user.profile.nickname === undefined; // true
```

这样的实体处于**未填充状态**。**未填充状态**下的实体**除了主键和少数关系字段以外**的任何字段都是空的。我们可以通过实体的 `[POPULATED]` 属性来获取实体的**填充状态**：

```ts
user[POPULATED]; // true
user.profile[POPULATED]; // false
```

::: tip
`POPULATED`是一个`symbol`。
:::

把实体标记成**已填充**的唯一途径便是调用`orm.em.popuate()`来填充该实体：

```ts
orm.em.popuate(Profile, {
  id: 999999,
  nickname: "马牛逼",
  bio: "你知道我有多牛逼吗？我敢吃屎！",
});
```

```ts
user.profile[POPULATED]; // true
```

## 检索实体

`orm.em.retrieve()` 会返回一个具有指定主键的实体，但该实体既可能是**已填充**的也可能是**未填充的**。

::: tip
Berry ORM 是一个专注于对象关系映射的库，请将实体存储到你自己管理的地方，不要依赖 Berry ORM 的内部存储。`orm.em.retrieve()` 应当很少被用到。
:::

```ts {4}
const user = orm.em.retrieve(User, 12345678);
user instanceof User; // true
user.id == 12345678; // true
user[POPULATED]; // false
```

对于相同的参数，`orm.em.retrieve()` 总会返回相同的引用。

```ts
orm.em.retrieve(User, 987654) == orm.em.retrieve(User, 987654); // true
```

## 清空内部存储

当遇到类似用户登出这种情况时，我们可能需要清空内部存储以确保其他用户专属的数据不会被意外泄露。

```ts
orm.em.clear();
```

原先的实体不会受影响，但接下来的**填充**操作不会再引用到旧的实体，而是会创建一个新的**未填充**实体。

::: danger
请务必同时清空你自己管理的实体存储以彻底地删除所有旧实体，否则一旦操作不当，便会导致令人困惑的意外表现。
:::

## 单独填充关系字段

`orm.em.populateRelationField()` 会单独填充实体的指定关系字段，数据格式与先前无异。这种填充**不会**更改实体的**填充状态**。

```ts {2}
user.department.id == 1; // true
orm.em.populateRelationField(user, "department", 2);
user.department.id == 2; // true
```

::: tip
请尽量避免单独填充关系字段。如果你想要更新关系，请直接通过实体来[更新关系](./updating-entities.html#更新关系)
:::
