# Introduction

Berry ORM is a lightweight object-relational mapper for Node.js and the browser.

```sh
npm i berry-orm
```

Berry ORM allows you transform between plain data objects and entities by defining entity classes. An entity is an instance of the entity class, which allows you to easily access and update bilateral relations. You can also transform an entity back into a plain data object.

Strict typing is a key focus of Berry ORM, therefore, all the features have advanced type support to maximize the benefits of TypeScript.

It is important to note that Berry ORM is not the same concept as a traditional ORM. The latter is usually a complete data management solution that includes additional features such as a database layer, where the object-relational mapper is only a coupled part, while the former is a generic object-relational mapper that is only responsible for mapping relations and you can freely combine it with other data management solutions.

# Scenarios

- When using relational state management in a web application
- When keeping large amounts of relational data in IndexedDB
- When storing relational data in simple files like "data.json"
- Any time you don't use a database but need to manage relational data
