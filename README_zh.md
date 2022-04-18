# Berry ORM

[English](./README.md)

充分利用 TypeScript 类型系统的纯粹的对象关系映射器。

```sh
npm i berry-orm
```

> **已测试的 TypeScript 编译器版本: TypeScript 4.1/4.2/4.3/4.4/4.5**

# 为什么？这是做什么的？

Berry ORM 是一个 **纯粹** 的 ORM，主要用于类型安全的 Web 前端开发。它只专注于将数据映射到类实例，不存在数据库或查询的概念。

等等，前端？为什么我会在前端需要一个 ORM？

## 我们解决的问题

假设我们在后端有两个实体：

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

以及一个会返回一个 user 数据列表的 API `/users`：

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

我们会如何处理这些数据呢？

由于 `Post` 的 `owner` 字段不存在，我们不能简单地复制后端的实体类型，那么或许我们可以调整类型，然后不加处理直接保存这些数据:

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

这样是有效的，但我们失去了从 post 反向访问关系的能力：

```ts
user.posts[0].owner;
```

更重要的是，如果我们在其他地方调用了一个 API，并且这个 API 返回了更新后的 post，那会怎么样？

```json
{ "id": 1, "title": "Hello!!!" }
```

没错，将会同时存在两个对象保存有同一个实体在不同时刻的不同数据。数据不一致的情况就可能出现了。

现在来考虑一下另一个会返回一个 post 数据列表的 API：

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

现在 `Post` 的 `owner` 字段回来了，但 `User` 的 `posts` 字段却又不见了。

我们应该如何定义接口类型呢？

我们可以定义更多的接口，进行重复操作，或者到处用 `Pick` 和 `Omit` 这类工具类型，把事情搞复杂。

## 我们解决方案

Berry ORM 在此！

使用 Berry ORM，我们可以像在后端做的那样在前端定义实体结构：

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

你再也不需要担心关系字段的处理了：

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

Berry ORM 会将这样嵌套的数据展平，构建缺失的对象关系，并确保对于一个实体只存在一个对象。

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

既然你已经读到这儿了，那么现在是时候试一试了！

# Documents

https://thenightmarex.github.io/berry-orm/
