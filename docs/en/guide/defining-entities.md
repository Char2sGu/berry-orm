# Defining Entities

An **_entity_** represents a record in the database. You can simply think of an entity as an object with an ID.

Berry ORM uses classes and decorators to describe the data structure of entities. All the decorators are strictly typed, which means that the TypeScript compiler will throw an error if you applied the decorators incorrectly.

## Defining Entity Classes

Every entity class should inherit `BaseEntity` and apply the `@Entity()` decorator.  
`BaseEntity` requires two generic type parameters, the first one is the **instance type** of the entity class, and the second one is the **name of the primary field**.

```ts
@Entity()
export class User extends BaseEntity<User, "id"> {
  // ...
}
```

::: warning

There are usually **circular references** between entities, so it is recommended to define and export entity classes in a **separate** module to avoid possible bugs.  
One practice is: `src/entities/user.ts`, `src/entities/profile.ts`.

:::

## Defining Entity Fields

### Data Fields

**_Data fields_** are the most common fields to store informations, there is no type restriction.

```ts {1}
@Field()
username!: string;
```

```ts {1}
@Field()
joinedAt!: Date;
```

### The Primary Key Field

Each entity can only have one **_primary key field_**, and its type must be assignable to `string` or `number`.

::: warning

- `@Primary()` must be applied **after** `@Field()`
- If `@Primary()` is applied in multiple fields，only the last one will take effect

:::

```ts {1}
@Primary()
@Field()
id!: number;
```

```ts {1}
@Primary()
@Field()
uuid!: string;
```

### To-One Relation Fields

**_To-One relation fields_** represent _OneToOne_ or _ManyToOne_ relations, and their types must be assignable to `BaseEntity | undefined | null`.

::: tip

Berry ORM does not need to know whether the relation is _OneToOne_ or _ManyToOne_, because for Berry ORM, they have the same meanings. (The same applies to [to-many relation fields](#To-Many-Relation-Fields))

:::

```ts {4,6}
// class User
@Relation({
  target: () => Profile,
  inverse: "owner",
})
@Field()
profile?: Profile;
```

The value of `inverse` is the field name of the entity on the other side of the relation, which points back to the entity on this side.

```ts {4,6}
// class Profile
@Relation({
  target: () => User,
  inverse: "profile",
})
@Field()
owner?: User;
```

::: warning

- `@Relation()` must be applied **after** `@Field()`
- If there is no data to specify the value of the to-one relation field, the value of the field may be `undefined`. In addition, [updating relations through to-one relation fields](./updating-entities.html#through-to-one-relation-fields) will also set the value of to-one relation fields to `undefined` temporarily. Therefore, it is recommended to use the _optional mark_ `?` instead of `!` to avoid potential bugs.

:::

### To-Many Relation Fields

**_To-many relationship fields_** represent _ManyToOne_ or _ManyToMany_ relations, and their types must be assignable to `Collection`.

::: tip

`Collection` is a special `Set`, used to support [updating relations through to-many relation fields](./updating-entities.html#through-to-many-relation-fields). Berry ORM will automatically instantiate `Collection` for you.

:::

```ts {4}
@Relation({
  target: () => User,
  inverse: "friends",
  multi: true,
})
@Field()
friends!: Collection<User>;
```

## Accessors and Methods

Each entity will be an instance of its entity class, therefore, you can define **accessors** and **methods** to separate your logic.

```ts
get fullName() {
  return `${this.firstName} ${this.lastName}`
}
```

```ts
getSuperiorMembers(user: User) {
  return [...this.department.members].filter(
    (member) => member.level > user.level,
  );
}
```

::: danger

The constructor of entity classes don't support overwrites with incompatible parameters. Please try to avoid overwriting constructors.

:::

## Example

```ts
// src/entities/user.ts
@Entity()
export class User extends BaseEntity<User, "id"> {
  @Primary()
  @Field()
  id!: number;

  @Field()
  username!: string;

  @Relation({
    target: () => Profile,
    inverse: "owner",
  })
  @Field()
  profile?: Profile;

  @Relation({
    target: () => User,
    inverse: "friends",
    multi: true,
  })
  @Field()
  friends!: Collection<User>;
}
```

```ts
// src/entities/profile.ts
@Entity()
export class Profile extends BaseEntity<Profile, "id"> {
  @Primary()
  @Field()
  id!: number;

  @Relation({
    target: () => User,
    inverse: "profile",
  })
  @Field()
  owner?: User;

  @Field()
  address!: string;
}
```
