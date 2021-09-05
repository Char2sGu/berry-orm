# 定义实体

一个 **_实体_** 代表着数据库里的一条记录。可以简单地认为，一个实体就是指一个具有 ID 的对象。

Berry ORM 通过类和装饰器来描述实体的数据结构。这些装饰器都具有严格的类型，这意味着当你错误地应用装饰器时，TypeScript 编译器会抛出一个错误。

## 定义实体类

每一个实体类都需要继承 `BaseEntity` 并应用 `@Entity()` 装饰器。  
`BaseEntity` 需要两个泛型参数，第一个是这个实体类的**实例类型**，第二个是**主键字段名**。

```ts
@Entity()
export class User extends BaseEntity<User, "id"> {
  // ...
}
```

::: warning

实体间通常存在**循环引用**，故建议在**单独**的模块中定义导出实体类以避免可能的错误。  
一种实践是：`src/entities/user.ts`、`src/entities/profile.ts`。

:::

## 定义实体字段

### 数据字段

**_数据字段_** 是用来存储信息的最普通的字段，没有类型限制。

```ts {1}
@Field()
username!: string;
```

```ts {1}
@Field()
joinedAt!: Date;
```

### 主键字段

每一种实体只能拥有一个 **_主键字段_**，且其类型必须可赋值给 `string` 或 `number`。

::: warning

- `@Primary()` 必须在 `@Field()` **之后**应用
- 如果在多个字段上应用了 `@Primary()`，则只有最后一个会生效

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

### 对单关系字段

**_对单关系字段_** 代表 _OneToOne_ 或 _ManyToOne_ 关系，其类型必须可赋值给 `BaseEntity | undefined | null`。

::: tip

Berry ORM 并不需要知道这个关系到底是 _OneToOne_ 还是 _ManyToOne_，因为对于 Berry ORM 而言，二者的处理方式是一样的。（[对多关系字段](#对多关系字段)同理）

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

`inverse` 的值是一个位于关系另一侧实体上的字段名，该字段指向这一侧的实体。

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

- `@Relation()` 必须在 `@Field()` **之后**应用
- 如果没有数据指定这个对单关系字段的值，则该字段的值可能为 `undefined`。此外，[通过对单关系字段更新关系](./updating-entities.html#通过对单关系字段)时也会短暂地将对单关系字段的值设置为`undefined`。故建议使用 _可选标记_ `?` 代替 `!` 以避免潜在的错误。

:::

### 对多关系字段

**_对多关系字段_** 代表 _ManyToOne_ 或 _ManyToMany_ 关系，其类型必须可赋值给 `Collection`。

::: tip

`Collection` 是一种特殊的 `Set`，用于支持[通过对多关系字段更新关系](./updating-entities.html#通过对多关系字段)。Berry ORM 会自动为你实例化 `Collection`。

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

## 访问器和方法

每一个实体都将是实体类的一个实例，故你可以在实体类上定义**访问器**和**方法**来分离你的逻辑。

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

实体类的构造函数不支持参数不兼容的覆写。请尽量避免覆写构造函数。

:::

## 示例

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
