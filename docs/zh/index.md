---
home: true
heroText: Berry ORM
tagline: 为前端打造的对象关系映射
actionText: 快速上手 →
actionLink: ./guide/introduction
---

```ts
const user = orm.em.populate(User, {
  id: 1,
  username: "Charles",
  department: 1,
  friends: [
    2,
    {
      id: 3,
      username: "Charles' Friend",
      department: 1,
    },
  ],
});
```

```ts
user instanceof User; // true
user.department instanceof Department; // true
user.department.id == 1; // true
user.department.members.has(user); // true
user.friends.forEach((friend) => {
  friend instanceof User; // true
  friend.friends.has(user); // true
});
```
