# Introduction

Berry ORM is an Object Relational Mapping library built for the front end. She focuses on and **only** focuses on Object Relational Mapping. In other words, Berry ORM is a library used to convert between **ordinary data objects** and **entities**.

Berry ORM attaches great importance to types, and all features have very strict type support to maximize the advantages of TypeScript. But this also means that Berry ORM has to give up some more convenient but unable to achieve strict typing features.

You must understand that the Berry ORM is very different from the common ORM libraries in back-ends. The back-end ORM library are usually complete data management solutions, and Object Relational Mapping is only a part of their features. But Berry ORM abides by its duty and is only responsible for mapping the relations between objects, because the data source of front-ends is usually a back-end API or IndexedDB, and there are already countless mature solutions for these data sources, and you can combine the best options to manage Your data.

```sh
npm i berry-orm
```
