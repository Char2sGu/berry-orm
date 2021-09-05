# 使用 EntityManager

`EntityManager` 实例由 `BerryOrm` 实例的 `.em` 属性提供。`EntityManager` 是最常用的一个 `Manager`，用于操作实体。

## 填充实体

**解析原始数据以更新相应实体的数据**的过程被称为 **_填充_**。填充是 Berry ORM 的核心功能之一。

### 填充非关系字段

填充用的原始数据**必须给每个非关系字段都指定一个值**。

```ts
const user = orm.em.populate(User, {
  id: 1,
  username: "Charles",
});
```

```ts
user instanceof User;
user.id == 1;
user.username == "Charles";
```

### 填充关系字段

任何**关系字段**在原始数据中都是可选的，因为通常关系某一侧的原始数据不会指定所有的关系，一些关系需要在另一侧的原始数据中被指定。

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

在这个例子中，`user.profile` 是属于 `user` 的，但是 `user.profile.owner` 却指定其属于另一个 `User`，关系冲突了。正确的做法是将 `user.profile.owner` 指定为符合现有关系的值，如：`1`；更好的做法是直接在数据中忽略 `user.profile.owner`，因为两者间的关系已经确定了，无需重复指定。

:::

Berry ORM 会建立**双向**的关系，这意味着你可以从关系的任意一侧访问另一侧：

```ts {3}
user.profile instanceof Profile;
user.profile.id == 1;
user.profile.owner == user;
```

~~这也意味着如果你愿意，你可以这样访问：~~

```ts
user.profile.owner.profile.owner.profile.owner.profile.owner.profile.owner
  .profile.owner.profile.owner.profile.owner.profile.owner.profile.owner.profile
  .owner.profile.owner.profile.owner.profile.owner.profile.owner.profile.owner
  .profile.owner.profile.owner.profile.owner.profile.owner.profile.owner.profile
  .owner.profile.owner.profile.owner.profile.owner.profile.owner.profile.owner
  .profile.owner.profile.owner.profile.owner.profile.owner.profile.owner.profile
  .owner.profile.owner.profile.owner.profile.owner.profile.owner.profile
  .nickname;
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

Berry ORM 一样会为它们建立**双向**的关系：

```ts
department.members.forEach((user) => {
  user.department == department;
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
user.profile.id == 999999;
user.profile.owner == user;
```

但是如果我们仔细观察 `user.profile` ，就会发现它任何其他字段的值都是空的（值为 `undefined` 或一个空的 `Collection`）：

```ts
user.profile.bio === undefined;
user.profile.nickname === undefined;
```

这样的实体处于**未填充状态**。**未填充状态**下的实体**除了主键和少数关系字段以外**的任何字段都是空的。我们可以通过实体的 `[POPULATED]` 属性来获取实体的**填充状态**：

```ts
user[POPULATED] == true;
user.profile[POPULATED] == false;
```

::: tip

`POPULATED`是一个`symbol`。

:::

把实体标记成**已填充**的**唯一途径**便是调用 `orm.em.popuate()` 来填充该实体：

```ts
orm.em.popuate(Profile, {
  id: 999999,
  nickname: "马牛逼",
  bio: "你知道我有多牛逼吗？我敢吃屎！",
});
```

```ts
user.profile[POPULATED] == true;
```

## 单独填充关系字段

`orm.em.populateRelationField()` 会单独填充实体的指定关系字段，数据格式与先前无异。这种填充**不会**更改实体的**填充状态**。

```ts
orm.em.populateRelationField(user, "friends", [1, 2, 3, 4]);
```

::: tip

大多数情况下，你可以直接通过实体字段来[更新关系](./updating-entities.html#更新关系)。

:::

## 导出实体

`.export()` 允许你将**实体**的数据 **_导出_** 为**普通对象**。导出是 Berry ORM 的另一个核心功能。

### 导出非关系字段

非关系字段的值会直接被赋值给数据对象。

```ts
const data = orm.em.export(user);
```

```ts
data.id == user.id;
data.username == user.username;
```

### 导出关系字段

关系会被默认导出为主键：

```ts
const data = orm.em.export(user);
```

```ts
typeof data.profile == "number";
data.friends instanceof Array;
data.friends.forEach((friend) => typeof friend == "number");
```

你可以通过第二个参数来控制哪些关系需要展开（支持嵌套）：

```ts {2,3}
const data = orm.em.export(user, {
  profile: true,
  friends: { profile: true },
});
```

```ts {1,3,4}
typeof data.profile == "object";
data.friends.forEach((friend) => {
  typeof friend == "object";
  typeof friend.profile == "object";
});
```

::: tip

返回值的类型会根据展开的关系自动变化。

:::

::: warning

如果尝试展开的关系实体处于[未填充状态](#实体的填充状态)，则 Berry ORM 会抛出一个错误。

:::
