---
home: true
heroText: Berry ORM
tagline: Object Relational Mapping for front-ends
actionText: Getting Started →
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
