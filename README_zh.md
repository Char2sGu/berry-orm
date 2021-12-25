# Berry ORM

[English](./README.md)

一个具备 **_❗ 超 棒 类 型 ❗_** 的轻量级对象关系映射器

> **类型仅适用于 TypeScript 4.3 和 4.4**

```sh
npm i berry-orm
```

**注意！** Berry ORM 是一个通用的对象关系映射器，只负责映射关系，你可以自由地将它与其他数据管理解决方案结合。

# 基础用法

## 定义实体

<details>

```ts
@Entity()
class Book extends BaseEntity<Book, "id"> {
  @Primary()
  @Field()
  id!: number;

  @Field()
  name!: string;

  @Relation({
    target: () => Author,
    inverse: "books",
  })
  @Field()
  author!: Author;
}

@Entity()
class Author extends BaseEntity<Author, "id"> {
  @Primary()
  @Field()
  id!: number;

  @Field()
  name!: string;

  @Relation({
    target: () => Book,
    inverse: "author",
    multi: true,
  })
  @Field()
  books!: Collection<Book>;
}
```

</details>

![](./res/defining-entities.gif)

## 解析数据

```ts
const orm = new BerryOrm({ entities: [Book, Author] });

const book1 = orm.em.resolve(Book, {
  id: 1,
  name: "1000 Ways to Code",
  author: 1,
});

book1[RESOLVED]; // true
book1.author[RESOLVED]; // false

const book2 = orm.em.resolve(Book, {
  id: 2,
  name: "2000 Ways to Code",
  author: { id: 1, name: "Char2s" },
});

book2[RESOLVED]; // true
book2.author[RESOLVED]; // true

book1.author == book2.author; // true
```

## 导出实体

<details>

```ts
const orm = new BerryOrm({ entities: [Book, Author] });

const book = orm.em.resolve(Book, {
  id: 1,
  name: "1000 Ways to Code",
  author: { id: 1, name: "Char2s" },
});

const data = orm.em.export(book, { author: { books: { author: true } } });
data.author.books[0].author.
```

</details>

![](./res/exporting-entities.gif)

# 文档

https://thenightmarex.github.io/berry-orm/
