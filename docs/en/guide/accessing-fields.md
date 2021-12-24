# Accessing Fields

Proxies are applied to entity fields during entity instantiations to change the behavior when accessing entity fields.

## Primary Fields

Primary fields are read-only. An `FieldAccessDeniedError` will be thrown when trying to set its value.

## Common Fields

Common Fields are read-write, just like normal properties.

Note that updates of fields will propagate in your whole application because of the `IdentityMap`.

```ts
user1.id; // 1
user2.id; // 1
user1 == user2; // true because of the IdentityMap
```

```ts {1}
user1.name = "new";
user2.name; // "new"
```

## Relation Fields

Assignments to _OneToOne_ and _ManyToOne_ fields will update entity relations.

```ts {1}
user.profile = newProfile; // construct/update the relation
oldProfile.owner; // undefined
newProfile.owner; // user
```

```ts {1}
user.profile = undefined; // destruct the relation
```

_OneToMany_ and _ManyToMany_ fields (`Collection` fields) cannot be assigned new values directly (read-only like primary fields), but you can manage entity relations by invoking its methods.

```ts {1}
department.members.add(user); // construct relations
department.members.has(user) == true;
user.department == department;
```

```ts {1}
department.members.delete(user); // destruct relations
department.members.has(user) == false;
user.department === undefined;
```

```ts {1}
department.members.clear(); // destruct all relations
department.members.size == 0;
user.department === undefined;
```
