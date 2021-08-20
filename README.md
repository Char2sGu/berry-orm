# Berry ORM

[中文](./README_zh.md)

Object Relational Mapping for front-ends.

# What it solves？

Usually, the front-end will not process the data obtained from the back-end, but directly uses these plain objects. In large-scale applications, this can easily lead to extremely complex and messy relation processing code. Berry ORM allows you to access relation objects directly through attributes to avoid the boring relation-processing code.

Let's take an extreme example:

When using Berry ORM, you can **directly access the relation objects through the attributes**:

```ts
user.department.tasks.forEach((task) => {
  console.log(task.creator.username);
});
```

While when Berry ORM is not used, you must obtain the relation objects manually according the primary keys:

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

# What it is not？

On the back-end, most _ORM_ libraries are not only responsible for **Object Relational Mapping**, but also include a variety of additional functions such as wrapping database queries, optimization of SQL statements, and so on. But Berry ORM is only responsible for **Object Relation mapping**, it is only responsible for mapping the relations between objects.

# Documents

The full documents are located at [Wiki](https://github.com/TheNightmareX/berry-orm/wiki).
