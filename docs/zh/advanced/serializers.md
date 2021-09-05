# 序列化器

序列化器可以使**非关系字段**的值在数据中的表现形式更加多样。

## 使用序列化器

`EntityManager` 实例的 `.populate()` 和 `.export()` 方法都支持配置序列化器。

Berry ORM 内置一个 **日期序列化器** 以允许日期类字段在数据中表现为一个字符串。

### 在填充中使用

通过使用 `DateSerializer`， `joinedAt` 在数据中的表现形式既可以和原来一样是一个 `Date`，也可以是一个 `string`：

```ts {5,7}
const user = orm.em.populate(
  User,
  {
    id: 1,
    joinedAt: new Date().toISOString(),
  },
  { joinedAt: DateSerializer },
);
```

```ts
user.joinedAt instanceof Date;
```

::: tip

`.populate()` 所接受的原始数据的类型会根据使用的序列化器自动变化。

:::

### 在导出中使用

通过使用 `DateSerializer`，`user.joinedAt` 在导出数据中的表现形式变成了 `string`：

```ts {2}
const data = orm.em.export(user, undefined, {
  joinedAt: DateSerializer,
});
```

```ts
typeof data.joinedAt == "string";
```

::: tip

`.export()` 返回值的类型会根据使用的序列化器自动变化。

:::

## 创建序列化器

只需要继承 `AbstractSerializer` 并实现其抽象方法即可创建一个序列化器。 `AbstractSerializer` 需要两个泛型参数，第一个是目标字段在实体中的值的类型，第二个是目标字段在数据中的表现形式的类型。

```ts
class StringNumberSerializer extends AbstractSerializer<number, string> {
  serialize(value: number) {
    return String(value);
  }
  deserialize(data: string) {
    return Number(data);
  }
  distinguish(data: number | string): data is number {
    return typeof data == number;
  }
}
```
