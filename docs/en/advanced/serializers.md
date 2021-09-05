# Serializers

The serializer can make the representation of the values of the **non-relation fields** in the data more diverse.

## Using Serializers

Both the `.populate()` and `.export()` methods of `EntityManager` instances support specifying serializers.

Berry ORM has a built-in `DateSerializer` to allow date fields to be represented as a string in the data.

### Using in Populations

By using `DateSerializer`, the representation of `joinedAt` in the data can be either a `Date` as before or a `string`:

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

The type of the original data accepted by `.populate()` will be automatically updated based on the serializers specified.

:::

### Using in Exportings

By using `DateSerializer`, the representation of `user.joinedAt` in exported data becomes a `string`:

```ts {2}
const data = orm.em.export(user, undefined, {
  joinedAt: DateSerializer,
});
```

```ts
typeof data.joinedAt == "string";
```

::: tip

The return type of `.export()` will be automatically updated based on the serializers specified.

:::

## Creating Serializers

It is only needed to inherit `AbstractSerializer` and implement its abstract methods to create a serializer. `AbstractSerializer` requires two generic type parameters, the first is the type of the value of the target field in the entity, and the second is the type of the representation of the target field in the data.

```ts
export class StringNumberSerializer extends AbstractSerializer<number, string> {
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
