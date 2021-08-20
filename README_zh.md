# Berry ORM

[English](./README.md)

为前端打造的纯粹的对象关系映射

# 它解决了什么？

通常，前端不会对从后端获取到的数据进行很多处理，而是会直接使用这些朴素对象（Plain Object）。在大型的应用中，这很容易导致**关系处理**变得异常复杂而凌乱。而 Berry ORM 可以让你**直接通过属性来访问关系对象**，省去无聊的手动关系处理过程。

让我们来举一个极端一点的例子：

当使用 Berry ORM 时，可以**直接通过属性来访问关系对象**：

```ts
user.department.tasks.forEach((task) => {
  console.log(task.creator.username);
});
```

当不使用 Berry ORM 时，关系通常由主键来表示，需要凭借主键手动获取关系对象：

```ts
const userDepartment = departmentMap[user.department];
const departmentTasks = Object.values(taskMap).filter(
  (task) => task.department == userDepartment.id,
);
departmentTasks.forEach((task) => {
  const taskCreator = userMap[task.creator];
  console.log(taskCreator.username);
});
```

# 它不是什么？

在后端，*ORM*库大多不仅负责**对象关系映射**，还包括了对数据库查询的包装、对 SQL 语句的优化等等众多额外的功能。但 Berry ORM 仅仅负责**对象关系映射**这一项，它仅仅负责映射对象间的关系。

# 文档

完整的文档位于 [Wiki](https://github.com/TheNightmareX/berry-orm/wiki) 。
