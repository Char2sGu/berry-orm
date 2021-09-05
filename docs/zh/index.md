---
home: true
heroText: Berry ORM
tagline: 为前端打造的对象关系映射库
actionText: 快速上手 →
actionLink: ./guide/introduction
features:
  - title: 类型严格
    details: 享受极致严格的类型所带来的愉快的开发体验，最大化发挥TypeScript的作用。
  - title: 轻量通用
    details: 专注且仅专注于对象关系映射，一点不多一点不少，轻松整合到任何框架。
  - title: 简单易学
    details: 通过简单的赋值和一个简单的API即可全方面地管理对象关系。
---

- 使用原始数据填充实体
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
- 主键将会被映射到到实际的实体
  ```ts
  user.profile instanceof Profile;
  user.friends.forEach((friend) => friend instanceof User);
  ```
- 关系是双向的，任意一边都可以访问另一边
  ```ts
  user.profile.owner == user;
  user.friends.forEach((friend) => friend.friends.has(user));
  ```
- 直接通过实体的关系字段更新关系
  - 对单关系：简单赋值
    ```ts
    user.profile = newProfile;
    ```
    ```ts
    user.profile == newProfile;
    newProfile.owner == user;
    ```
  - 对多关系：调用方法
    ```ts
    user.friends.add(newFriend);
    ```
    ```ts
    user.friends.has(newFriend);
    newFriend.friends.has(user);
    ```
- 在任何地方具有同一主键的同种实体都是同一个对象
  ```ts
  userA.department.id == userB.department.id;
  userA.department == userB.department;
  ```
- 可以访问未填充状态实体的部分字段
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
- 将实体数据重新导出为普通对象
  ```ts
  orm.em.export(user);
  ```
  ```ts
  user.constructor == Object;
  typeof user.profile == "number";
  user.friends.forEach((friend) => typeof friend == "number");
  ```
