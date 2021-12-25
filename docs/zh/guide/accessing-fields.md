# 访问字段

在实体实例化过程中，访问器将被应用于实体字段，以改变访问实体字段时的行为。

## 主键字段

主键字段是只读的。当试图对其赋值时，将抛出一个 `FieldAccessDeniedError`。

## 普通字段

普通字段是可读可写的，和普通属性一样。

请注意，由于 `IdentityMap` 的存在，对字段的更新将在你的整个应用程序中传播。

```ts
user1.id; // 1
user2.id; // 1
user1 == user2; // true，因为有 IdentityMap
```

```ts {1｝
user1.name = "new";
user2.name; // "new"
```

## 关系字段

对 _一对一_ 和 _多对一_ 字段的赋值将更新实体关系。

```ts {1}.
user.profile = newProfile; // 构建/更新关系
oldProfile.owner; // undefined
newProfile.owner; // user
```

```ts{1}
user.profile = undefined; // 破坏关系
```

_一对多_ 和 _多对多_ 字段（`Collection` 字段）不能直接赋值（像主字段一样只读），但是你可以通过调用它的方法来管理实体关系。

```ts {1}
department.members.add(user); // 构建关系
department.members.has(user) == true;
user.department == department;
```

```ts {1}
department.members.delete(user); // 破坏关系
department.members.has(user) == false;
user.department === undefined;
```

```ts {1}
department.members.clear(); // 破坏所有关系
department.members.size == 0;
user.department === undefined;
```
