# 使用 IdentityMapManager

`IdentityMapManager` 实例由 `BerryOrm` 实例的 `.imm` 属性提供。`IdentityMapManager` 负责管理每一种实体的 `IdentityMap`，而 `IdentityMap` 负责保存该种实体所有实例的引用。

## 清空引用存储

当遇到类似用户登出的情况时，我们可能需要清空引用存储以确保该用户专属的数据不会被意外泄露。

```ts
orm.imm.clear();
```

原先的实体不会受影响，但接下来的对象关系映射将不会再引用到旧的实体，而是会创建一个新的**未填充**实体。

::: tip

通常，清空 Berry ORM 的引用存储后，你还需要清空你自己的数据存储以彻底避免引用到旧的实体。

:::
