# Defining Entities

An **entity** represents a record in the database. In other words, an **entity** is an object with a primary key like `id`.

Each element in the data list obtained from the backend is **data** **representing an entity**. Usually, we will directly use these unprocessed **data**, which can easily lead to messy and bad code, and the responsibility of Berry ORM is to restore **data** into **entity** to eliminate the boring relation processing.

In order to resolve the **data** and restore it to **entity** correctly, it is required to define an **entity class** and its **fields** for each type of entity.

## Defining Entity Classes

Every entity class should inherit `BaseEntity` and apply the `@Entity()` decorator.

::: warning
Since there are probably circular references in the definition of entity classes, entity classes should be defined and exported in separated modules.
:::

```ts {2,3}
// src/entities/user.ts
@Entity()
export class User extends BaseEntity {
  // ...
}
```

::: tip
If you copy this example directly into your project, you will get a type error caused by `@Entity()`, because there isn't any **field that can be the primary key** in the current `User`.
:::

::: danger
It is not supported to override the constructor with incompatible parameters. Try to avoid overriding the constructor.
:::

## Defining Entity Fields

**Fields** are special properties of the **entity class** with the `@Field()` decorator applied. In Berry ORM, there are four types of entity fields.

### The Primary Key Field

Each entity can only have one **primary key field**, and its type must be assignable to `string | number`.

::: warning
If you accidentally defined multiple primary key fields, only the last defined primary key field will take effect. Try to avoid this from happening.
:::

```ts {3}
@Entity()
export class User extends BaseEntity {
  @Field({ type: "primary" })
  id!: number;
}
```

```ts {3}
@Entity()
export class User extends BaseEntity {
  @Field({ type: "primary" })
  uuid!: string;
}
```

### Data Fields

**Data fields** are common fields that stores data, and there is no type requirements.

```ts {3,6}
@Entity()
export class User extends BaseEntity {
  @Field()
  username!: string;

  @Field()
  bio!: string;
}
```

### To-One Relation Fields

A **To-One relation field** represents an _OneToOne_ or _ManyToOne_ relation, and its type must be assignable to `BaseEntity | undefined | null`:

::: tip
Berry ORM does not need to know whether the relation of this field is _OneToOne_ or _ManyToOne_, because for Berry ORM, they have the same meanings. (The same applies to **To-Many relation fields**)
:::

```ts {4-6}
@Entity()
export class User extends BaseEntity {
  @Field({
    type: "relation",
    target: () => Profile, // the target entity class
    inverse: "owner", // the inverse field on `Profile` entities
  })
  profile?: Profile;
}
```

```ts {4-6}
@Entity()
export class Profile extends BaseEntity {
  @Field({
    type: "relation",
    target: () => User,
    inverse: "profile",
  })
  owner?: User;
}
```

::: danger
If there is no data that specifies the relation of the **To-One relation field**, the value of the field may be `undefined`. In addition, [Updating Relations](./updating-entities#updating-relations) will also temporarily set the value of the **To-One relation field** to `undefined`. Therefore, it is recommended to use `?` instead of `!` to indicate that the property is optional.
:::

### To-Many Relation Fields

A **To-Many relationship field** represents a _ManyToOne_ or _ManyToMany_ relation, and its type must be assignable to `Collection`:

::: tip
`Collection` is a special `Set`, used to support updating relations through **To-Many relation fields**.
:::

```ts {7}
@Entity()
export class User extends BaseEntity {
  @Field({
    type: "relation",
    target: () => Address,
    inverse: "owner",
    multi: true,
  })
  addresses!: Collection<Address>;
}
```

## Completing Type Support

In fact, `BaseEntity` accepts two optional generic type parameters, but it is strongly recommended to provide them for better type support:

```ts {3}
// src/entities/user.ts
@Entity()
export class User extends BaseEntity<User, "id"> {
  @Field({ type: "primary" })
  id!: number;
}
```
