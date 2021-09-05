# 更新实体

`BerryOrm` 实例会在内部维护一个引用存储来通过类型和主键来保存一切涉及到的实体的引用。因此，对于任何位置的实体，只要类型和主键相同，Berry ORM 会保证它们都相等（`==`），换句话说，它们是同一个对象。

```ts {7}
user1.department instanceof Department;
user1.department.id == 1;

user2.department instanceof Department;
user2.department.id == 1;

user1.department == user2.department;
```

## 更新数据

因此，对于数据字段，只需要直接对其进行赋值，更改便会作用到任何位置。

```ts
user1.department.name = "New Name";
```

```ts
user2.department.name == "New Name";
```

## 更新关系

### 通过对单关系字段

Berry ORM 在实体的**对单关系字段**上定义了访问器，因此你同样可以通过直接赋值来更新双向的关系。

```ts
user.profile = newProfile;
```

Berry ORM 会先拆除旧的关系，然后再建立新的关系：

```ts
oldProfile.owner != user;
newProfile.owner == user;
```

::: danger

在拆除旧的关系到建立新的关系期间，`user.profile` 的值可能会短暂地被赋值为 `undefined`。

:::

你也可以将其赋值为 `undefined` 来手动拆除关系。

```ts
user.profile = undefined;
```

### 通过对多关系字段

**对多关系字段**的值都是 `Collection` 实例。`Collection` 是一种特殊的 `Set`，可以通过调用 `Collection` 的方法来便捷地更新关系。

```ts {1}
department.members.add(user);
```

```ts
department.members.has(user) == true;
user.department == department;
```

```ts {1}
department.members.delete(user);
```

```ts
department.members.has(user) == false;
user.department === undefined;
```

```ts {1}
department.members.clear();
```

```ts
department.members.size == 0;
user.department === undefined;
```
