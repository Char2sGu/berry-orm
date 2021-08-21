# 构造 BerryOrm 实例

`BerryOrm` 实例是 Berry ORM 的顶级实例。

构造该实例需要传入用到的所有**实体类**。如果一种实体与另几种实体存在关系，则这几种实体的实体类必须**都**传入或**都**不传入。

```ts
// src/orm.ts
export const orm = new BerryOrm({
  entities: [User, Department, Profile],
});
```

`BerryOrm` 实例的 `.em` 属性提供了一个 `EntityManager` 实例。在应用中，对实体的操作大多将会通过`EntityManager`来完成。

::: tip
在构造 `BerryOrm` 实例的过程中会对传入的实体类进行检查，以帮助你尽可能降低运行时出错的可能性。
:::
