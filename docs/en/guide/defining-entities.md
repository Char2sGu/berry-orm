# Defining Entities

Entities in Berry ORM are instances of decorated classes extending `BaseEntity`. There is no need to worry about property name pollutions because there are only a few `Symbol` properties defined in the `BaseEntity`.

## Preparing the Class

Entity class should extend `BaseEntity` and be applied the `@Entity()` decorator.  
Some type parameters are required when extending `BaseEntity`. One is the entity class itself which is being defined, while the other is the primary field of that entity class.

```ts
@Entity()
export class User extends BaseEntity<User, "id"> {
  // ...
}
```

Don't worry about the type error. It is an intentional behavior because the primary field specified in the type parameters has not been defined yet.

::: tip Recommended Practices

- Write a `@Entity()` at the very beginning to have a type error when forgetting to extend the `BaseEntity`.
- Define entities in separate files to avoid potential issues caused by circular references. (e.g. `src/entities/user.entity.ts`)

:::

::: warning

There will be an type error thrown by `@Entity()` if the constructor is overwritten with incompatible parameters.

:::

## Defining Fields

### Common Fields

For most fields storing data, there is only a `@Field()` required for them to be declared.

```ts {1}
@Field()
username!: string;
```

```ts {1}
@Field()
joinedAt!: Date;
```

::: tip Non-Nullable Operator

We are using the non-nullable operator `!` here because TypeScript compiler in strict mode require class properties to have a default or to be assigned a value in the constructor, unless there is a non-nullable operator suffixed.

:::

::: warning

- There will be an `EntityMetaError` when `@Field()` is applied for multiple times on one field.

:::

### The Primary Field

There **must be one and only one** primary field defined in an entity class. To define the primary field, simply apply a `@Primary()` **after(above)** `@Field()`.

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

::: warning

- There will be an `EntityMetaError` when `@Primary()` is applied before(below) `@Field()` or is applied for multiple times in one entity class.
- There will be a type error unless `@Primary()` is applied on a field with type `string` or `number`. Fields with type `string | number` are not valid choices either.

:::

### Relation Fields

Similarly, for relations, apply a `@Relation()` **after(above)** `@Field()`

```ts {2,4}
// class Book
@Relation({
  target: () => Author,
  inverse: "books",
  multi: false, // optional
})
@Field()
author!: Author;
```

In the code above, we defined a relation field in the `Book` class with `multi` set to `false`. Such relation fields can represent _OneToOne_ or _ManyToOne_ relations.

The value of `inverse` should be a field of the target entity which points back to this entity. And of course, it is strictly typed, with value limited and auto-completion enabled.

```ts {2,4}
// class Author
@Relation({
  target: () => Book,
  inverse: "author",
  multi: true,
})
@Field()
books!: Collection<Book>;
```

And here we defined another relation field in the `Author` class but with `multi` set to `true`, which can represent _OneToMany_ or _ManyToMany_ relations.

_ToMany_ relation fields should have a `Collection` type and will be automatically assigned a `Collection` instance during the instantiation of entities.

::: warning

- There will be an `EntityMetaError` when `@Relation()` is applied before(below) `@Field()` or is applied for multiple times on one field.
- There will be a type error unless `@Relation()` is applied to a field with type `Collection<...>` matching the specified `target`.

:::

## Accessors and Methods

You can define **accessors** and **methods** to move some logic here.

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
