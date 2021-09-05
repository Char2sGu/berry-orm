# Updating Entities

The `BerryOrm` instance will maintain a reference store internally to store references to all involved entities based on the types and primary keys. Therefore, for entities in any location, as long as their types and primary keys are the same, Berry ORM will ensure that they are all equal (`==`), in other words, they are the same object.

```ts {7}
user1.department instanceof Department;
user1.department.id == 1;

user2.department instanceof Department;
user2.department.id == 1;

user1.department == user2.department;
```

## Updating Data

Therefore, for the **data fields**, you only need to assign a value to it, and the change will be applied anywhere.

```ts
user1.department.name = "New Name";
```

```ts
user2.department.name == "New Name";
```

## Updating Relations

### Through To-One Relation Fields

Berry ORM defines accessors on **To-One relation fields** of the entities, so you can also update the bilateral relation by directly assigning values.

```ts
user.profile = newProfile;
```

Berry ORM will first destruct the old relation and then construct the new relation:

```ts
oldProfile.owner != user;
newProfile.owner == user;
```

::: danger

The value of `user.profile` may be temporarily assigned to `undefined` during the period between the destruction of the old relation and the construction of the new relation.

:::

You can also specify an `undefined` to destruct the relation manually.

```ts
user.profile = undefined;
```

### Through To-Many Relation Fields

The values of the **multi-relation fields** are all `Collection` instances. `Collection` is a special `Set`, you can update relations easily by invoking the methods of `Collection`.

```ts {1}
department.members.add(user);
```

```ts
user.department == department;
```

```ts {1}
department.members.delete(user);
```

```ts
user.department === undefined;
```

```ts {1}
department.members.clear();
```

```ts
department.members.size == 0;
user.department === undefined;
```
