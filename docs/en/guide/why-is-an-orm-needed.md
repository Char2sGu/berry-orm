# Why the Front-ends Need ORM

In the data obtained from the back-end, the relations between objects are usually represented by primary keys, which makes it easy to get cumbersome to access relation objects.

For example, when requesting `/users/1/` the following data will be returned:

```json {4}
{
  "id": 1,
  "username": "Charles",
  "profile": 1
}
```

This is the data returned when requesting `/profiles/1/`:

```json {3}
{
  "id": 1,
  "owner": 1,
  "nickname": "Charlie"
}
```

Now, `user.profile` is just the primary key of the target `Profile`, and `profile.owner` is also just the primary key of the target `User`. To access the actual relation object, we need to perform additional operations.

::: tip

The additional operations might look like this:

```ts
const profile = store.profiles[user.profile];
```

:::

Of course, the back-end may also send `user.profile` as a nested data object:

```json
{
  "id": 1,
  "username": "Charles",
  "profile": {
    "id": 1,
    "owner": 1,
    "nickname": "Charlie"
  }
}
```

Then `user.profile` is an object now:

```ts
const profile = user.profile;
```

But `user.profile.owner` is still a primary key, you can't access the `User` through `profile.owner` in reverse.

**But what if ORM is used?**

ORM will construct **bilateral** relations, so you can:

```ts
const profile = user.profile.owner.profile.owner.profile.owner.profile;
```

This is only part of the features of Berry ORM, please continue reading to explore more uses of Berry ORM.
