---
home: true
heroText: Berry ORM
tagline: 用于 Node.js 和浏览器的严格类型的轻量级对象关系映射器。
actionText: 快速上手 →
actionLink: ./guide/introduction
features:
  - title: 类型严格
    details: 享受极致严格的类型所带来的愉快的开发体验，最大化发挥TypeScript的作用。
  - title: 轻量通用
    details: 仅仅是对象关系映射，没有任何多余的功能，可在任何场景下使用。
  - title: 简单易用
    details: 通过简单的赋值和调用即可完全控制对象关系。
---

## 实体定义

```ts {6,10,14,19,24,28}
@Entity()
export class User extends BaseEntity<User, "id"> {
  // 主键字段
  @Primary()
  @Field()
  id!: number;

  // 数据字段
  @Field()
  firstName!: string;

  // 数据字段
  @Field()
  lastName!: string;

  // 对单关系字段
  @Relation({ target: () => Profile, inverse: "owner" })
  @Field()
  profile?: Profile;

  // 对多关系字段
  @Relation({ target: () => User, inverse: "friends", multi: true })
  @Field()
  friends!: Collection<User>;

  // 数据字段
  @Field()
  joinedAt!: Date;

  // 自定义访问器
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // 自定义方法
  capitalize() {
    this.firstName.toUpperCase();
    this.lastName.toUpperCase();
  }
}
```

## 数据到实体

```ts
const user = orm.em.populate(
  User,
  {
    id: 1,
    firstName: "Gu",
    lastName: "Charles",
    profile: 1,
    friends: [
      2, // 外键
      { id: 3 /* , ... */ }, // 嵌套的数据对象
    ],
    joinedAt: new Date().toISOString(), // 由于应用了 `DateSerializer`，`string` 和 `Date` 都可以接受
  },
  {
    joinedAt: DateSerializer, // 为字段 "joinedAt" 支持更灵活的输入值
  },
);
```

## 实体到数据

```ts
const data = orm.em.export(
  user,
  {
    profile: true, // 将 `.profile` 导出为一个嵌套对象
    friends: { profile: true }, // 支持嵌套
  },
  {
    joinedAt: DateSerializer, // 使 `user.joinAt` 被导出为 `string`，而不是 `Date`
  },
);
```
