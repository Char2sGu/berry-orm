---
home: true
heroText: Berry ORM
tagline: Object Relational Mapping for front-ends
actionText: Getting Started →
actionLink: ./guide/introduction
features:
  - title: Strictly Typed
    details: Enjoy the pleasant development experience brought by the full range of strict typing, and maximize the advantage of TypeScript.
  - title: Lightweight and Universal
    details: Focus on and only focus on Object Relational Mapping, no more, no less, easy to integrate into any framework.
  - title: Easy to Use
    details: There are not many APIs, invoking just one method is enough to convert the original data into an entity and allow you to enjoy the complete object relations.
---

- Directly resolve the data obtained from the backend to get the entity
  ```ts
  const userData = await axios.get("/users/1/");
  const user = em.populate(User, userData);
  ```
- All the entities are instances of their entity classes
  ```ts
  user instanceof User;
  ```
- Values of relation fields are no longer just a primary key or an array of primary keys
  ```ts
  user.profile instanceof Profile;
  user.friends instanceof Collection;
  user.friends.forEach((friend) => friend instanceof User);
  ```
- Relations are bilateral, either side of the relations can access the other side
  ```ts
  user.profile.owner == user;
  user.friends.forEach((friend) => friend.friends.has(user));
  ```
