# 定义实体

在 Berry ORM 中，实体是应用了装饰器并继承了 `BaseEntity` 的类的实例。 无需担心属性名称污染，因为 `BaseEntity` 上仅仅定义了极少数的 `symbol` 属性。

## 准备实体类

实体类需要继承 `BaseEntity` 并应用 `@Entity()` 装饰器。  
继承 `BaseEntity` 时需要一些类型参数。一个是正在定义的类本身，另一个是该类的主键字段。

```ts
@Entity()
export class User extends BaseEntity<User, "id"> {
  // ...
}
```

无需担心出现的类型错误。这是一个有意的行为，因为在类型参数中指定的主键字段目前还未被定义。

::: tip 建议的实践

- 在最开始的时候就先写一个 `@Entity()`，以此来在错误定义实体类时获取一个类型错误。
- 在分开的文件中定义实体，以此来避免因循环引用而导致的潜在问题。（例如 `src/entities/user.entity.ts`）

:::

::: warning

如果构造函数被重写，且参数类型不兼容，`@Entity()` 将会抛出一个类型错误。

:::

## 定义字段

### 普通字段

对于大多数存储数据的字段，声明它们只需要一个 `@Field()`。

```ts {1}
@Field()
username!: string;
```

```ts {1}
@Field()
joinedAt!: Date;
```

::: tip 非空操作符

我们在这里使用了非空操作符 `!`，因为在严格模式下，TypeScript 编译器要求类的属性必须具有一个默认值或在构造函数中被赋值，除非有一个非空操作符作为后缀。

:::

::: warning

- 当 `@Field()` 在一个字段上应用多次时，将会抛出一个 `EntityMetaError`。

:::

### 主键字段

在一个实体类中，**必须有且仅有**一个主键字段被定义。要定义主键字段，只需在 `@Field()` **之后（之上）** 应用一个 `@Primary()`。

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

- 当 `@Primary()` 在 `@Field()` 之前（之下）应用，或者在一个实体类中多次应用时，将会抛出一个 `EntityMetaError`。
- 除非 `@Primary()` 在一个具有 `string` 或 `number` 类型的字段上应用，否则将会出现一个类型错误。具有 `string | number` 类型的字段同样不是合法的选择。

:::

### 关系字段

相似地，对于关系，在 `@Field()` **之后（之上）** 应用一个 `@Relation()`。

```ts {2,4}
// class Book
@Relation({
  target: () => Author,
  inverse: "books",
  multi: false, // 可选的
})
@Field()
author?: Author;
```

在上面的代码中，我们在 `Book` 类中定义了一个将 `multi` 设置为 `false` 的关系字段。这样的关系字段可以表示 _一对一_ 或 _多对一_ 关系。

::: tip 建议的实践

使用可选操作符 `?` 代替非空操作符 `!`。因为当没有数据对象指定其关系时，这样的关系字段的值可能会是 `undefined`。此外，[访问字段](./accessing-fields.html#relation-fields) 中会说到，我们可以对该字段赋值一个 `undefined` 来拆除关系。

:::

`inverse` 的值需要是目标实体类的一个关系字段，该字段反过来指向这个实体类。当然，它是具备了严格类型的，具有值的限制和自动补全。

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

这里我们在 `Author` 类中定义了另一个关系字段，但这次 `multi` 设置为了 `true`，这样的字段可以表示 _一对多_ 或 _多对多_ 关系。

_对多_ 关系字段需要具有一个 `Collection` 类型，并且在实例化实体时，它们会自动被赋值一个 `Collection` 实例。

::: tip

`Collection` 是从 `Set` 派生的。

:::

::: warning

- 当 `@Relation()` 在 `@Field()` 之前（之下）应用，或在一个字段上多次应用时，将会抛出一个 `EntityMetaError`。
- 除非 `@Relation()` 被应用于类型为 `Collection<...>` 的字段，且与指定的 `target` 选项相匹配，否则将会出现一个类型错误。

:::

## 访问器和方法

你可以在实体类上定义访问器和方法。

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
