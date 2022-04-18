# Berry ORM

[中文](./README_zh.md)

A pure ORM that takes full advantage of TypeScript's type system.

```sh
npm i berry-orm
```

> **Tested TypeScript Compiler Version: 4.1/4.2/4.3/4.4/4.5**

# Why? What for?

Berry ORM is a **pure** ORM designed mainly for type-safe Web frontend development. It only focuses on mapping data to class instances, no database, no query.

Wait, frontend? Why we need an ORM for frontend?

## The Issue

Let's say we have two entities at our backend:

```ts
interface User {
  id: number;
  name: string;
  posts: Post[];
}

interface Post {
  id: number;
  owner: User;
  title: string;
}
```

And we have an API `/users` that returns a list of user data:

```json
[
  {
    "id": 1,
    "name": "Charles",
    "posts": [
      { "id": 1, "title": "Hello" },
      { "id": 2, "title": "World" }
    ]
  }
]
```

How would we process the data at the frontend?

Since the `owner` field of `Post` doesn't exist, we cannot simply copy the entity type from the backend, so maybe we could adjust the interface and simply store it without any processing:

```ts
interface User {
  id: number;
  name: string;
  posts: Post[];
}

interface Post {
  id: number;
  title: string;
  // owner: User;
}
```

This works, but we loss the ability to access the inverse relation from posts:

```ts
user.posts[0].owner;
```

What's more, what if we call an API elsewhere that returns the data of the updated post?

```json
{ "id": 1, "title": "Hello!!!" }
```

Yes, there would be two objects storing different data for one post. Data inconsistencies can occur.

Now let's consider another API `/posts` that returns a list of post data:

```json
[
  {
    "id": 1,
    "owner": { "id": 1, "name": "Charles" },
    "title": "Hello"
  },
  {
    "id": 2,
    "owner": { "id": 1, "name": "Charles" },
    "title": "World"
  }
]
```

Now the `owner` field of `Post` is back, while the `posts` field of `User` is gone.

How should we define the interfaces?

We can repeat ourselves by defining another two interfaces, or we can make a mess by using utility types `Pick` and `Omit` everywhere.

## The Solution

Berry ORM is here!

With Berry ORM, we can define the schema of the entities just like at the backend:

```ts
@Entity()
class User extends BaseEntity<User, "id"> {
  @Primary()
  @Field()
  id!: number;

  @Field()
  name!: string;

  @Relation({ target: () => Post, inverse: "owner", multi: true })
  @Field()
  posts!: Collection<Post>;
}

@Entity()
class Post extends BaseEntity<Post, "id"> {
  @Primary()
  @Field()
  id!: number;

  @Relation({ target: () => User, inverse: "posts" })
  @Field()
  owner?: User;

  @Field()
  title!: string;
}
```

You never have to worry about relational fields again:

```ts
const user = orm.em.resolve(User, {
  id: 1,
  name: "Charles",
  posts: [
    { id: 1, title: "Hello" },
    { id: 2, title: "World" },
  ],
});
```

Berry ORM will flatten the nested data, construct the missing relations and ensure that there is only one object for one entity.

```ts
for (const post of user.posts) {
  console.log(post.owner == user); // true
}
```

```ts
user.posts.clear();
for (const post of user.posts) {
  console.log(post.owner); // undefined
}
```

```ts
user.name = "Berry";
for (const post of user.posts) {
  console.log(post.owner.name); // "Berry"
}
```

If you have read until here, it's time to give it a try!

# Documents

https://thenightmarex.github.io/berry-orm/
