# Using EntityManager

The `EntityManager` instance is provided on the `.em` property of `BerryOrm` instances. `EntityManager` is the most commonly used `Manager` for manipulating entities.

## Populating Entities

**The process of parsing the original data to update the data of the corresponding entity** is called **_populating_**. Populating is one of the core features of Berry ORM.

### Populating non-relation fields

The original data used for populating **must specify a value for each non-relation field**.

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

### Populating Relation Fields

Any **relation field** is optional in the original data, because usually the original data of one side of the relation does not specify all the relations, and some relations need to be specified in the original data on the other side.

#### Populating To-One Relation Fields

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
  profile: { id: 1, nickname: "Charlies" },
});
```

::: warning

If the inverse relation to the parent data object is specified in the nested data object, please ensure that they won't conflict, otherwise it may cause the wrong relations to be constructed.

Here is a wrong example:

```ts {2,7}
const user = orm.em.populate(User, {
  id: 1,
  username: "Charles",
  profile: {
    id: 1,
    nickname: "Charlies",
    owner: 2,
  },
});
```

In this example, `user.profile` belongs to `user`, but `user.profile.owner` specifies that it belongs to another `User`, the relation conflicts. The correct approach is to specify `user.profile.owner` as a value that conforms to the existing relations, such as `1`; a better approach is to completely ignore `user.profile.owner` in the nested data, because the relation between them has already been determined, and there is no need to specify it repeatly.

:::

Berry ORM will construct a **bilateral** relation, which means you can access the other side from either side of the relation:

```ts {3}
user.profile instanceof Profile;
user.profile.id == 1;
user.profile.owner == user;
```

This also means that if you want, you can access the value like this:  
XD

```ts {1}
user.profile.owner.profile.owner.profile.owner.profile.owner.profile.nickname;
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

Berry ORM will construct a **bilateral** relation for them as well:

```ts
department.members.forEach((user) => {
  user.department == department;
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
user.profile.id == 999999;
user.profile.owner == user;
```

But if we take a closer look at `user.profile`, we will find that the value of any other field is empty (the value is `undefined` or an empty `Collection`):

```ts
user.profile.bio === undefined;
user.profile.nickname === undefined;
```

Such entities are in an **unpopulated state**. Any fields of entities in an **unpopulated state** are empty, **except the primary key and a few relation fields**. we can get the **population state** of the entity through its `[POPULATED]` property:

```ts
user[POPULATED] == true;
user.profile[POPULATED] == false;
```

::: tip

`POPULATED` is a `symbol`.

:::

The **only way** to mark an entity as **populated** is to invoke `orm.em.popuate()` to populate the entity:

```ts
orm.em.popuate(Profile, {
  id: 999999,
  nickname: "Nickname",
  bio: "orz orz orz orz orz",
});
```

```ts
user.profile[POPULATED] == true;
```

## Populating a Relation Field Separately

`orm.em.populateRelationField()` will separately populate the specified relation field of the entity, the data type is the same as before. This **will not** change the **population state** of the entity.

```ts
orm.em.populateRelationField(user, "friends", [1, 2, 3, 4]);
```

::: tip

In most cases, you can [update relations](./updating-entities.html#updating-relations) directly through entity fields.

:::

## Exporting Entities

`.export()` allows you to **_export_** the data of an **entity** as an **plain ordinary object**. Exporting is another core feature of Berry ORM.

### Exporting Non-relation Fields

The value of the non-relation fields will be directly assigned to the data object.

```ts
const data = orm.em.export(user);
```

```ts
data.id == user.id;
data.username == user.username;
```

### Exporting Relation Fields

Relations will be exported as primary keys by default:

```ts
const data = orm.em.export(user);
```

```ts
typeof data.profile == "number";
data.friends instanceof Array;
data.friends.forEach((friend) => typeof friend == "number");
```

You can use the second parameter to control which relations need to be expanded (nesting is supported):

```ts {2,3}
const data = orm.em.export(user, {
  profile: true,
  friends: { profile: true },
});
```

```ts
typeof data.profile == "object";
data.friends.forEach((friend) => {
  typeof friend == "object";
  typeof friend.profile == "object";
});
```

::: tip

The return type will be automatically updated based on the expanded relations.

:::

::: warning

If the relation entity you are trying to expand is in [unpopulated state](#population-state-of-entities), Berry ORM will throw an error.

:::
