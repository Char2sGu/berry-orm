# Berry ORM

为前端而生的纯粹的对象关系映射

```ts
const user = orm.populate(User, {
  id: 1,
  username: "Charles",
  addresses: [
    1, // 主键
    { id: 2, content: "成华大道" }, // 嵌套数据
  ],
});
user instanceof User; // true
user.addresses.forEach((address) => {
  address.id; // 1 2
  address instanceof Address; // true true
  address.owner == user; // true true
  address.content; // undefined "成华大道"
  address[POPULATED]; // false true
});
```

# 用法

## 定义实体类

一个*实体*代表一条数据表中的记录。

在不使用 ORM 时，*实体*仅由简单对象（Plain Object）来表示：

```ts
interface User {
  id: number;
  lastName: string;
  firstName: string;
}

const user = await axios.get<User>("/users/1/");
user.id; // 1
user.lastName; // "马"
user.firstName; // "牛逼"
```

而 Berry ORM 要求为每一种*实体*定义一个*实体类*，在 Berry ORM 中，每一个*实体*都会是对应*实体类*的一个实例：

```ts
@Entity()
class User extends BaseEntity {
  @Field({ type: "primary" })
  id!: number;

  @Field()
  lastName!: string;

  @Field()
  firstName!: string;

  get fullName() {
    return `${this.lastName} ${this.firstName}`;
  }
}
```

这样的好处是：

- 允许通过 `instanceof` 操作符来快速区分实体
- 允许通过**装饰器**来定义字段
- 允许为实体创建计算属性和方法

```ts
const userData = await axios.get("/users/1/");
const user = orm.populate(User, userData);
user instanceof User; // true;
user.fullName; // "马 牛逼"
```

`BaseEntity`接受两个类型参数，虽然它们是可选的，但**强烈建议**提供它们以获得完整的类型支持：

```ts
@Entity()
class User extends BaseEntity<User, "id"> {
  @Field({ type: "primary" })
  id!: number;
}
```

> 实体类**不允许**自定义构造函数。

## 定义实体类字段

`@Field()` 装饰器用于定义实体字段，共有四种类型的字段。

> `@Field()`对字段类型具有严格的要求，如果装饰器被应用在不符合类型要求的字段上，TypeScript 编译器将会抛出一个错误。

### 主键字段

每一种实体的只能拥有一个**主键字段**，且其类型必须可赋值给 `string | number`：

> 如果定义了多个主键，则只取最后定义的主键。请尽量避免这种情况的发生。

```ts
@Field({ type: "primary" })
id!: number;
```

```ts
@Field({ type: "primary" })
uuid!: string;
```

### 数据字段

**数据字段**即存储数据的普通字段，没有类型限制：

```ts
@Field()
username!: string;

@Field()
bio!: string;
```

### 对单关系字段

**对单关系字段**代表 _OneToOne_ 或 _ManyToOne_ 关系，其的类型必须可赋值给 `BaseEntity | undefined | null`：

```ts
@Field({
  type: "relation",
  target: () => Department, // 目标实体类
  inverse: "members", // 在 `Department` 实体上的逆向字段
})
department?: Department;
```

> 如果没有数据指定**对单关系字段**的关系，则该字段的值可能为 `undefined`。故建议使用 `?` 而非 `!` 以表示该属性可选，除非你很确定不可能出现 `undefined` 的情况。

### 对多关系字段

**对多关系字段**表示 _ManyToOne_ 或 _ManyToMany_ 关系，其类型必须可赋值给 `Collection`：

> `Collection` 是一种特殊的 `Set`，用于支持更新对多关系。

```ts
@Field({
  type: "relation",
  target: () => Address,
  inverse: "owner",
  multi: true, // 表示该字段为对多关系字段
})
addresses!: Collection<Address>;
```

## 创建 BerryOrm 实例

`BerryOrm` 实例是 Berry ORM 的中心实例，该实例提供对象关系映射，同时也将会根据实体的类型和主键来存储所有实体。

构造 `BerryOrm` 实例需要传入所有想要在该实例中使用的实体类：

```ts
const orm = new BerryOrm({
  entities: [User, Department, Address],
});
```

> 在 `BerryOrm` 的实例化的过程中，将会对传入的实体类进行检查，检查项包括：装饰器遗漏、主键缺失、未知关系实体等。

> 如果一个实体类中定义了关系字段，则该关系字段对应的实体类也需要传入。

## 填充

**解析数据并赋值给实体**的过程称为**填充**，**填充**是 Berry Orm 最主要的功能。

### 填充数据字段

`orm.populate()` 会根据传入的实体类和**数据**返回一个填充了数据的实体类实例。`orm.populate()`所接受的**数据**必须给该实体的每一个数据字段都指定一个值：

```ts
const user = orm.populate(User, {
  id: 1,
  username: "Charles",
});
```

```ts
user instanceof User; // true
user.id; // 1
user.username; // "Charles"
```

### 填充数据字段和关系字段

`orm.populate()`接受的数据可以**可选地**给关系字段指定关系。

关系既可以使用主键来指定，也可以使用嵌套的数据对象来指定：

```ts
const user = orm.populate(User, {
  id: 1,
  username: "Charles",
  department: 1,
  addresses: [1, 2],
});
```

```ts
const user = orm.populate(User, {
  id: 1,
  username: "Charles",
  department: {
    id: 1,
    name: "xxx部门",
  },
  addresses: [
    { id: 1, content: "成华大道" },
    { id: 2, content: "我家还蛮大的" },
  ],
});
```

Berry ORM 会根据数据建立实体间的**双向关系**：

```ts
user.department.members.has(user); // true
user.addresses.forEach((address) => {
  address.owner == user; // true
});
```

值得注意的是，在嵌套数据中指定的对于父数据的反向关系将被忽略：

> 不影响绝大部分使用情况，因为被忽略的关系会在其他数据中被指定。

```ts
const user = orm.populate(User, {
  id: 1,
  username: "Charles",
  department: {
    id: 1,
    name: "xxx部门",
    members: [1, 2, 3], // 将被忽略
  },
  addresses: [
    {
      id: 1,
      content: "成华大道",
      owner: 1, // 将被忽略
    },
  ],
});
```

### 填充关系字段

在极少数情况下，也可以通过 `orm.populateRelationField()` 来单独填充关系字段：

```ts
orm.populateRelationField(user, "department", 1);
```

```ts
user.department.members.has(user); // true
```

## 实体填充状态

使用主键来**填充关系字段**时，可以指定任意的主键，即使该主键所对应的实体还未知：

```ts
const user = orm.populate(User, {
  id: 1,
  department: 9999999999999999999,
});
```

此时，以下表达式依然成立：

```ts
user.department.id == 9999999999999999999; // true
user.department.members.has(user); // true
```

但是，此时该 `Department` 实体的任何**数据字段**的值都是`undefined`：

```ts
user.department.name === undefined; // true
```

这样的实体处于**未填充状态**，这种状态下的实体除了主键字段和**部分**关系字段以外的所有其他字段的值都是`undefined`。

可以根据实体的`POPULATED`属性来获取实体的**填充状态**：

```ts
user[POPULATED] == true; // true
user.department[POPULATED] == true; // false
```

这样设计的好处在于，即使关系实体的数据还未知，依然可以访问关系实体的**主键字段**和**部分关系字段**。

## 检索

`BerryOrm` 实例提供 `.retrieve()` 方法以从存储的所有实体中检索具有指定主键的实体：

```ts
const user = orm.retrieve(User, 1);
```

`orm.retrieve()` 总会返回一个实体，但该实体可能处于[未填充状态](#实体填充状态)。

> Berry ORM 是一个纯粹的对象关系映射库，不应该使用 `BerryOrm` 实例来存储实体。实体应该存储在你自己能够管理的地方。

## 更新

### 更新数据

Berry ORM 保证对于同一实体具有单一引用，对实体某一数据字段的更新可以立即反馈到其他实体：

```ts
user.username; // "old username"
userAddress.owner.username; // "old username"
```

```ts
user.username = "new username";
```

```ts
user.username; // "new username"
userAddress.owner.username; // "new username"
```

### 更新关系

### 更新对单关系字段

对于**对单关系字段**, 只需要将新的关系实体赋值给字段即可更新双向关系：

```ts
user.department == oldDepartment; // true
oldDepartment.members.has(user); // true
```

```ts
user.department = newDepartment;
```

```ts
user.department == oldDepartment; // false
oldDepartment.members.has(user); // false
user.department == newDepartment; // true
newDepartment.members.has(user); // true
```

### 更新对多关系字段

对于**对多关系字段**，可通过调用 `Collection` 的 `.add()`、`.delete()`、`.clear()` 方法来更新双向关系：

```ts
user.addresses.add(newAddress);
user.addresses.has(newAddress); // true
newAddress.owner == user; // true
```

```ts
user.addresses.delete(newAddress);
user.addresses.has(newAddress); // false
newAddress.owner == user; // false
```

```ts
user.addresses.clear();
user.addresses.size; // 0
```
