# 准备 ORM

我们的实体已经定义好了，现在是时候使用它们了。

```ts
export const orm = new BerryOrm({
  entities: [User, Department, Profile],
});
```

所有我们想要在 `BerryOrm` 实例中使用的实体都需要被传递到 `entities` 选项。

实体检查将会在 `BerryOrm` 实例化的过程中执行，以确保这些实体可以正常使用。

- 每个实体类都必须应用 `@Entity()`。
- 如果注册了一个实体类，与其存在关系的所有实体类都需要同时注册。
- 不允许注册具有相同类名的实体类。
