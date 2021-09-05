# 构造 BerryOrm 实例

`BerryOrm` 实例是 Berry ORM 的顶级实例。

```ts
// src/orm.ts
export const orm = new BerryOrm({
  entities: [User, Department, Profile],
});
```

如果一种实体与另几种实体间存在关系，则这几种实体的实体类必须**都**传入或**都**不传入。

这个实例在其属性上暴露了几个 `Manager` 实例，其中最常用的是 `.em` 上暴露的 `EntityManager` 实例。

::: tip
`BerryOrm` 的构造函数会检查传入的实体类是否都合法，以帮助你尽可能减少应用运行过程中出现的错误。
:::
