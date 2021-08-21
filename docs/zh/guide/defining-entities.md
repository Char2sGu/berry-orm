# 定义实体

一个**实体**代表数据库里的一条记录。换句话说，一个**实体**就是一个具有类似`id`这样的主键的对象。

从后端获取到的数据列表中的每一个元素都是**表示一个实体**的**数据**。通常，我们会直接使用这些未经处理的**数据**，这很容易导致混乱糟糕的代码，而 Berry ORM 的职责便是将 **数据** 重新还原为 **实体** 以省去枯燥的关系处理过程。

为了正确地解析**数据**并将其还原为**实体**， 必须为每一种实体定义一个**实体类**并定义该实体所拥有的**字段**。

## 定义实体类

每一个实体类都需要继承`BaseEntity`并应用`@Entity()`装饰器。

::: warning
由于实体类的定义过程中很可能存在循环引用，请尽量在单独的模块中定义并导出实体类。
:::

```ts {2,3}
// src/entities/user.ts
@Entity()
export class User extends BaseEntity {
  // ...
}
```

::: tip
如果把这个样例直接复制进你的项目，你会得到一个由`@Entity()`引发的类型错误，因为当前的`User`中没有定义任何**符合主键要求**的**字段**。
:::

::: danger
实体类的构造函数不支持参数不兼容的覆写。请尽量避免覆写构造函数。
:::

## 定义实体字段

**字段**是**实体类**中应用了`@Field()`装饰器的特殊属性。Berry ORM 中，实体的字段共分为四种。

### 主键字段

每一种实体只能拥有一个**主键字段**，且其类型必须可赋值给 `string | number`。

::: warning
如果不小心定义了多个主键字段，则只有最后定义的主键字段会生效。请尽量避免这种情况的发生。
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

### 数据字段

**数据字段**即存储数据的普通字段，没有类型限制。

```ts {3,6}
@Entity()
export class User extends BaseEntity {
  @Field()
  username!: string;

  @Field()
  bio!: string;
}
```

### 对单关系字段

**对单关系字段**代表 _OneToOne_ 或 _ManyToOne_ 关系，其类型必须可赋值给 `BaseEntity | undefined | null`：

::: tip
Berry ORM 并不需要知道这个字段上的关系到底是 _OneToOne_ 还是 _ManyToOne_，因为对于 Berry ORM 而言，二者的处理方式是一样的。（**对多关系字段**同理）
:::

```ts {4-6}
@Entity()
export class User extends BaseEntity {
  @Field({
    type: "relation",
    target: () => Profile, // 目标实体类
    inverse: "owner", // 在 `Profile` 实体上的逆向字段
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
如果没有数据指定**对单关系字段**的关系，则该字段的值可能为 `undefined`。此外，[更新关系](./updating-entities#更新关系)时也会短暂地将**对单关系字段**的值设置为`undefined`。故建议使用 `?` 而非 `!` 以表示该属性可选。
:::

### 对多关系字段

**对多关系字段**代表 _ManyToOne_ 或 _ManyToMany_ 关系，其类型必须可赋值给 `Collection`：

::: tip
`Collection` 是一种特殊的 `Set`，用于支持通过对多关系字段来更新关系。
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

## 完善类型支持

实际上，`BaseEntity`接受两个可选的泛型类型参数，强烈建议传入它们以获得完整的类型支持：

```ts {3}
// src/entities/user.ts
@Entity()
export class User extends BaseEntity<User, "id"> {
  @Field({ type: "primary" })
  id!: number;
}
```
