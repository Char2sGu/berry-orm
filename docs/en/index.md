---
home: true
heroText: Berry ORM
tagline: Object Relational Mapping library for front-ends
actionText: Getting Started →
actionLink: ./guide/introduction
features:
  - title: Strictly Typed
    details: Enjoy the pleasant development experience brought by the extremely strict types, and maximize the advantages of TypeScript.
  - title: Lightweight and Universal
    details: Focus on and only focus on Object Relational Mapping, no more, no less, easy to integrate into any framework.
  - title: Easy to Use
    details: Fully manage objects' relations through simple assignments and a simple API.
---

- Populate the entity using the original data
  ```ts
  const user = orm.em.populate(User, {
    id: 1,
    profile: 1,
    friends: [2, { id: 3, profile: 3 }],
  });
  ```
  ```ts
  user instanceof User;
  ```
- Primary keys will be mapped to the actual entity
  ```ts
  user.profile instanceof Profile;
  user.friends.forEach((friend) => friend instanceof User);
  ```
- Relations are bilateral and each side is able to access each other
  ```ts
  user.profile.owner == user;
  user.friends.forEach((friend) => friend.friends.has(user));
  ```
- Update the relations directly through the relation fields
  - To-one relations: simple assignments
    ```ts
    user.profile = newProfile;
    ```
    ```ts
    user.profile == newProfile;
    newProfile.owner == user;
    ```
  - To-many relations: method calls
    ```ts
    user.friends.add(newFriend);
    ```
    ```ts
    user.friends.has(newFriend);
    newFriend.friends.has(user);
    ```
- Entities of the same kind with the same primary key everywhere are the same object
  ```ts
  userA.department.id == userB.department.id;
  userA.department == userB.department;
  ```
- Partial fields of an unpopulated entity are accessible
  ```ts
  const userWithUnpopulatedProfile = orm.em.populate(User, {
    id: 1,
    profile: 123456789,
  });
  ```
  ```ts
  userWithUnpopulatedProfile[POPULATED] == true;
  userWithUnpopulatedProfile.profile[POPULATED] == false;
  userWithUnpopulatedProfile.profile instanceof Profile;
  userWithUnpopulatedProfile.profile.id == 123456789;
  userWithUnpopulatedProfile.profile.owner == userWithUnpopulatedProfile;
  ```
- Re-export the entity data as an plain ordinary object
  ```ts
  orm.em.export(user);
  ```
  ```ts
  user.constructor == Object;
  typeof user.profile == "number";
  user.friends.forEach((friend) => typeof friend == "number");
  ```
