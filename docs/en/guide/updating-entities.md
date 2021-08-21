# Updating Entities

The `BerryOrm` instance will maintain a store internally, and stores references to all the entities involved through the type and primary key. Therefore, for entities everywhere, as long as the type and primary key are the same, they are strictly equal (`===`). In other words, they are actually the same object.

```ts {7}
user1.department instanceof Department;
user1.department.id == 1;

user2.department instanceof Department;
user2.department.id == 1;

user1.department === user2.department; // true
```

## Updating Data

Therefore, for the **data fields**, you only need to assign a value to it, and the change will be applied anywhere.

```ts
user1.department.name = "New Name";
user2.department.name == "New Name"; // true
```

## Updating Relations

**To-One relation fields** and **To-Many relation fields** both support updating any kind of relations.

### Through To-One Relation Fields

Berry ORM defines accessors on **To-One relation fields** of the entities, so you can also update the bilateral relation by directly assigning values.

```ts
user.profile = newProfile;
```

Berry ORM will first destruct the old relation and then construct the new relation:

```ts
oldProfile.owner == user; // false
newProfile.owner == user; // true
```

::: danger
The value of `user.profile` may be temporarily assigned to `undefined` during the period between the destruction of the old relation and the construction of the new relation.
:::

You can also specify an `undefined` to destruct the relation manually.

```ts
user.profile = undefined;
```

### Through To-Many Relation Fields

The values of the **multi-relation fields** are all `Collection` instances. `Collection` is a special `Set` whose methods supports updating bidlateral relations.

```ts {1}
department.members.add(user);
user.department == department; // true
```

```ts {1}
department.members.delete(user);
user.department === undefined; // true
```

```ts {1}
department.members.clear();
department.members.size == 0; // true
user.department === undefined; // true
```
