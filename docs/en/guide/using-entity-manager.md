# Using EntityManager

## Populating Entities

The process of **resolving data and assigning values to the fields of the corresponding entities** is called **populating**. **Populating** is the core feature of Berry ORM.

### Populating the Primary Key and Data

The data used for **populating** must specify values of the **primary key field** and all the **data fields** of the entity.

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

### Populating Relations

If the value of the entity's **relation fields** are provided, Berry ORM will resolve these values and construct relations on the corresponding fields of both the two entities.

::: tip
The type of the **data** used for populating is tailored for the return value of the back-end APIs, any **relation fields** are optional in **data**.
:::

#### Populating To-One Relation Fields

**对单关系字段**在数据中的表现形式既可以是一个**主键**：
A **To-One Relation Field** in the data can be represented as either a **primary key**:

```ts {4}
const user = orm.em.populate(User, {
  id: 1,
  username: "Charles",
  profile: 1,
});
```

or a **nested data object**:

```ts {4}
const user = orm.em.populate(User, {
  id: 1,
  username: "Charles",
  profile: { id: 1, nickname: "王大锤" },
});
```

::: warning
If the inverse relation to the parent data object is specified in the nested data object, please ensure that they won't conflict, otherwise it may cause the wrong relations to be constructed. For example:

```ts {2,7}
const user = orm.em.populate(User, {
  id: 1,
  username: "Charles",
  profile: {
    id: 1,
    nickname: "Nickname",
    owner: 2,
  },
});
```

In this example, if `profile.owner` is specified, the value must match the existing relations. In the existing relations, the `Profile` belongs to this `User`, but another `User` is specified as its owner in the data of the `Profile`. The relations conflict. To solve this, `profile.owner` should be specified as a value that conforms to the existing relations, such as: `1`; it is better to ignore `profile.owner` in the nested data directly, because the relation between the two has already been determined and there is no need to specify it repeatly.

:::

Berry ORM will construct **bilateral** relations:

```ts {3}
user.profile instanceof Profile; // true
user.profile.id == 1; // true
user.profile.owner == user; // true
```

This also means that if you want, you can access the value like this:  
XD

```ts {1}
user.profile.owner.profile.owner.profile.owner.profile.owner.profile.nickname; // Nickname
```

#### Populating To-Many Relation Fields

**To-many relationship fields** are represented in the data as an array _whose values are **primary keys** or **nested data objects**_:

```ts {4}
const department = orm.em.populate(Department, {
  id: 1,
  name: "XXXXXX",
  members: [1, 2, { id: 3, username: "XDXDXDXD" }],
});
```

::: warning
Similarly, if an inverse relation to the parent data object is specified in the nested data object, please ensure that they will not conflict.
:::

Also, a **bilateral** relation will be constructed:

```ts
department.members.forEach((user) => {
  user.department == department; // true
});
```

## Population State of Entities

You may have noticed that even though the entity represented by the primary key specified for the **relation field** in the data is not yet known:

```ts {4}
const user = orm.em.populate(User, {
  id: 1,
  username: "Charles",
  profile: 999999,
});
```

The following expressions still hold:

```ts
user.profile instanceof Profile;
user.profile.id == 999999; // true
user.profile.owner == user; // true
```

But if we take a closer look at `user.profile`, we will find that the value of any other field is empty (the value is `undefined` or an empty `Collection`):

```ts
user.profile.bio === undefined; // true
user.profile.nickname === undefined; // true
```

Such an entity is in the **unpopulated state**, we can get the population state of the entity through the `[POPULATED]` property of the entity:

```ts
user[POPULATED]; // true
user.profile[POPULATED]; // false
```

::: tip
`POPULATED` is a `symbol`.
:::

The only way to mark an entity as **populated** is to invoke `orm.em.popuate()` to populate the entity:

```ts
orm.em.popuate(Profile, {
  id: 999999,
  nickname: "Nickname",
  bio: "orz orz orz orz orz",
});
```

```ts
user.profile[POPULATED]; // true
```

## Retriving Entities

`orm.em.retrieve()` will return an entity with the specified primary key, but the entity may be either **populated** or **unpopulated**.

::: tip
Berry ORM is a library that focuses on only Object Relational Mapping. Please store the entities in a place that you manage. Don't dependent on the internal store of Berry ORM. `orm.em.retrieve()` should be rarely used.
:::

```ts {4}
const user = orm.em.retrieve(User, 12345678);
user instanceof User; // true
user.id == 12345678; // true
user[POPULATED]; // false
```

For the same parameters, `orm.em.retrieve()` will always return a same reference.

```ts
orm.em.retrieve(User, 987654) == orm.em.retrieve(User, 987654); // true
```

## Clearing the Internal Store

When encountering a situation like a user logged out, we may need to clear the internal store to ensure that the user-specific data will not be leaked unexpectedly.

```ts
orm.em.clear();
```

The previous entities will not be affected, but the future **populating** operations will no longer refer to the previous entities, but will create a new **unpopulated** entity.

::: danger
Please be sure to clear the entity stores you manage too to completely remove all the previous entities, otherwise, it can easily lead to confusing and unexpected behaviors.
:::

## Populating a Relation Field Separately

`orm.em.populateRelationField()` will separately populate the specified relation field of the entity, the data type is the same as before. This **will not** change the **population state** of the entity.

```ts {2}
user.department.id == 1; // true
orm.em.populateRelationField(user, "department", 2);
user.department.id == 2; // true
```

::: tip
Try to avoid populating relation fields separately. If you want to update the relation, please directly [update the relations](./updating-entities.html#updating-relations) through the entity.
:::
