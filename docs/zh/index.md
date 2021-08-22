---
home: true
heroText: Berry ORM
tagline: 为前端打造的对象关系映射
actionText: 快速上手 →
actionLink: ./guide/introduction
features:
  - title: 类型严格
    details: 享受全方位的严格类型所带来的愉快的开发体验，最大化发挥TypeScript的作用。
  - title: 轻量通用
    details: 专注且仅专注于对象关系映射，一点不多一点不少，轻松整合到任何框架。
  - title: 简单易学
    details: 没有过多的API，只需要调用一个方法即可将普通数据转换到具有完整对象关系的实体，通过简单赋值即可更新对象关系。
---

- 直接解析从后端获取的数据来获取实体
  ```ts
  const userData = await axios.get("/users/1/");
  const user = em.populate(User, userData);
  ```
- 所有的实体都是实体类的实例
  ```ts
  user instanceof User;
  ```
- 关系字段的值不再只是一个主键或一组主键
  ```ts
  user.profile instanceof Profile;
  user.friends.forEach((friend) => friend instanceof User);
  ```
- 关系是双向的，关系的任意一边都可以访问另一边
  ```ts
  user.profile.owner == user;
  user.friends.forEach((friend) => friend.friends.has(user));
  ```
