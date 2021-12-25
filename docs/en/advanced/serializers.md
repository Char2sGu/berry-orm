# Serializers

Serializers allow **non-relational** fields' representations more diverse.

## Using Serializers

Berry ORM has a built-in `DateSerializer` allowing fields with a `Date` type to be represented using a `string` instead of a `Date` in plain data objects.

### Resolving Data with Serializers

By using `DateSerializer`, the representation of `joinedAt` in the plain data object can be `Date | string` instead of `Date`.

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

The type of the `data` parameter of `orm.em.resolve()` is dynamic based on the `serializers` parameter you specified.

:::

### Exporting Entities with Serializers

By using `DateSerializer`, the representation of `user.joinedAt` in the exported object will be a `string` instead of a `Date`.

```ts {1}
const data = orm.em.export(user, {}, { joinedAt: DateSerializer });

typeof data.joinedAt; // "string"
```

::: tip

The return type of `orm.em.export()` is dynamic based on the `serializers` parameter you specified.

:::

## Creating Serializers

Serializers are classes extending `AbstractSerializer` with its abstract methods implemented.

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
