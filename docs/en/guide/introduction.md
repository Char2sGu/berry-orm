# Introduction

Berry ORM is an Object Relational Mapping library built for the front-end, focus on and **only** focus on Object Relational Mapping, which means that Berry ORM will not take over your storage needs, you are free to choose your own storage solutions.

Berry ORM uses **classes** and **decorators** to define entities. In applications using Berry ORM, each entity will be an instance of its entity class. Therefore, you can easily use the `instanceof` operator to distinguish entity types, and you can also define **methods** and **computed properties** on the entity classes to better comply with the Single Responsibility Principle.

In addition, Berry ORM is completely written in TypeScript and has complex and strict types to better ensure type safety. You will discover the pleasant development experience brought by these types in the process of using.

```sh
npm i berry-orm
```

::: tip
Berry ORM does not take over storage, because the front-end data source is usually the back-end interface or IndexedDB, and many mature frameworks for packaging these data sources already exist.
:::
