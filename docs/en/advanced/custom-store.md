# Custom Store

By default, Berry ORM will create `IdentityMap`s internally to store references to all the entities, and you need to manage your data yourself.

For a certain entity, if you want to share the store with Berry ORM, you can configure it in `@Entity()` options.

```ts {1}
@Entity({ map: () => yourMap })
export class User extends BaseEntity<User, "id"> {
  @Field({ type: "primary" })
  id!: number;
}
```

::: tip
The function passed will be invoked when instantiating `BerryOrm`.
:::
