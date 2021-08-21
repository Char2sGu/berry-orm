# Introduction

Berry ORM is an Object Relational Mapping library built for the front-end, allowing you to directly access relation objects through the properties of entities, avoiding a lot of complicated and boring relational processing codes in front-end projects.

Berry ORM uses **classes** and **decorators** to define entities. In applications using Berry ORM, each entity will be an instance of its entity class. Therefore, you can easily use the `instanceof` operator to distinguish entity types, and you can also define **methods** and **computed properties** on the entity classes to better comply with the Single Responsibility Principle.

In addition, Berry ORM is completely written in TypeScript and has complex and strict types to better ensure type safety. You will discover the pleasant development experience brought by these types in the process of using.

```sh
npm i berry-orm
```
