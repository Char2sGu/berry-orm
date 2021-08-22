# 自定义存储

默认地，Berry ORM 会在内部创建`IdentityMap`来保存一切实体的引用，你需要额外自行管理你的数据。

对于某种实体，如果你想要和 Berry ORM 共用一个存储，可以在`@Entity()`中设置。

```ts {1}
@Entity({ map: () => yourMap })
export class User extends BaseEntity<User, "id"> {
  @Field({ type: "primary" })
  id!: number;
}
```

::: tip
传入的函数将在实例化 `BerryOrm` 时被调用。
:::
