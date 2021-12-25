# 序列化器

序列化器允许**非关系**字段的表示变得更加多样。

## 使用序列化器

Berry ORM 内置一个 `DateSerializer`，允许具有 `Date` 类型的字段在普通数据对象中被表示为 `string` 而不是 `Date`。

### 解析数据时使用序列化器

通过使用 `DateSerializer`，`joinedAt` 的在普通数据对象中的表示可以是 `Date | string` 而不是 `Date`。

```ts {5,7}
const user = orm.em.resolve(
  User,
  {
    id: 1,
    joinedAt: new Date().toISOString(),
  },
  { joinedAt: DateSerializer },
);

user.joinedAt instanceof Date; // true
```

::: tip

`orm.em.resolve()` 的 `data` 参数的类型是动态的，基于你所指定的 `serializers` 参数。

:::

### 导出实体时使用序列化器

通过使用 `DateSerializer`，`user.joinedAt` 在普通数据对象中的表示方式将会是 `string` 而不是 `Date`。

```ts {1}
const data = orm.em.export(user, {}, { joinedAt: DateSerializer });

typeof data.joinedAt; // "string"
```

::: tip

`orm.em.export()` 的返回值类型时动态的，基于你所指定的 `serializers` 参数。

:::

## 创建序列化器

序列化器是继承了 `AbstractSerializer` 并实现了其抽象方法的类。

```ts
export class DateSerializer extends AbstractSerializer<Date, string> {
  serialize(value: Date): string {
    return value.toISOString();
  }
  deserialize(value: string | Date): Date {
    return new Date(value);
  }
}
```
