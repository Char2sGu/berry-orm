# Berry ORM

为前端而生的对象关系映射

# 用法

## 定义实体

在 Berry ORM 中，实体是继承`BaseEntity`的一个类，通过装饰器来声明字段：

```ts
@Entity()
class User extends BaseEntity<User, "id"> {
  @Field({ type: "primary" })
  id!: number;
}
```

你一定注意到了，`BaseEntity`接受了两个泛型参数——第一个是实体本身，第二个是主键字段——这实际上是可选的，但强烈建议传递这两个参数以获得更好的类型支持。

**不要忘记`@Entity()`装饰器！！**

> 实体类的构造函数不能被覆写。

## 声明字段

`@Field()` 装饰器用于声明实体字段，共有四种类型的字段：

> Berry ORM 的装饰器都具有严格的类型，如果装饰器被应用在不正确的字段上，TypeScript 编译器将会抛出一个错误。

### 主键字段

_主键_ 用于区分不同实体，实体的**主键字段**必须为 `string` 或 `number` 类型：

```ts
@Field({ type: "primary" })
id!: number;
```

### 数据字段

**数据字段**是存储信息的普通字段，没有类型限制：

```ts
@Field()
username!: string;
```

### 对单关系字段

**对单关系字段**是一种关系字段，表示 _OneToOne_ 或 _ManyToOne_ 关系，**对单关系字段**的类型必须可赋值给 `BaseEntity | undefined | null`：

> 如果填充实体的数据没有指定该**对单关系字段**的关系，并且关系实体中也不存在对该**对单关系字段**的逆向关系，则该**对单关系字段**可能为 `undefined`。故，推荐使用 `?` 而非 `!` 以表示该属性可选，除非你很确定不可能出现 `undefined` 的情况。

```ts
@Field({
  type: "relation",
  target: () => Department, // 目标实体类
  inverse: "members", // 在 `Department` 上的逆向字段 （提供类型支持）
})
department?: Department;
```

### 对多关系字段

**对多关系字段**当然也是一种关系字段，表示 _ManyToOne_ 或 _ManyToMany_ 关系，**对多关系字段**的类型必须为 `Collection`：

> `Collection` 是一种特殊的 `Set`，允许直接更新双向关系，下文会详细讲解。

```ts
@Field({
  type: "relation",
  target: () => Address,
  inverse: "owner",
  multi: true, // 表示该字段为对多字段
})
addresses!: Collection<Address>;
```

## 创建 BerryOrm 实例

在 `BerryOrm` 的实例化的过程中，将会对传入的实体进行检查，检查项包括：装饰器遗漏、主键缺失、未知关系实体等。

```ts
const orm = new BerryOrm({
  entities: [User, Department, Address],
});
```

## 检索实体

`BerryOrm` 实例提供 `retrieve()` 方法以从存储中检索具有指定 _主键_ 的实体：

```ts
const user = orm.retrieve(User, 1);
```

不论如何，该方法都会返回一个 `User` 实例，但该实例不一定具有数据，详见[填充实体](#填充实体)。

## 填充实体

**解析数据并赋值给实体**的过程称为 _填充_。填充用的数据必须给所有的**数据字段**都指定一个值，但**对单关系字段**和**对多关系字段**的数据是可选的：

```ts
const user = orm.populate(User, {
  id: 1,
  username: "Charles",
  department: 1,
  addresses: [1, 2],
});
```

```ts
user.department instanceof Department; // true
user.department.members.has(user); // true
user.addresses instanceof Collection; // true
user.addresses.size; // 2
const addresses = [...user.addresses];
addresses[0] instanceof Address; // true
addresses[0].id; // 1
addresses[0].content; // undefined
addresses[0].owner == user; // true
```

你一定已经注意到了，虽然在数据中用主键指定的实体是未知的，但 `addresses[0]` 依然是一个 `Address` 实例，但这个实例除了主键和`owner`字段，所有数据字段都是 `undefined`。要区分实体是否有数据，可以通过实例的 `[POPULATED]` 属性(`POPULATED`是一个`symbol`)，该属性指示实体是否已被填充。

> `entity[POPULATED] == true` 只能保证所有的数据字段都被指定了值，不包括关系字段。

**对单关系字段** 和 **对多关系字段** 在数据中既可以像这样是一个主键 ，也可以是一个嵌套的数据对象：

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

值得注意的是，在嵌套的对象中指定的对于父数据的反向关系将被忽略，但这并不影响绝大部分使用情况：

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

## 更新

### 更新数据

Berry ORM 保证对于同一实体具有单一引用，对实体某一数据字段的更新可以立即反馈到其他实体：

```ts
user.username; // "old username"
userAddress.owner.username; // "old username"
user.username = "new username";
user.username; // "new username"
userAddress.owner.username; // "new username"
```

### 更新关系

对于**对单关系字段**, 只需要将新的关系实体赋值给字段即可更新双向关系：

```ts
user.department == oldDepartment; // true
oldDepartment.members.has(user); // true

user.department = newDepartment;

user.department == oldDepartment; // false
oldDepartment.members.has(user); // false
user.department == newDepartment; // true
newDepartment.members.has(user); // true
```

对于**对多关系字段**，可通过调用 `Collection` 的 `.add()`、`.delete()`、`.clear()` 更新双向关系：

```ts
user.addresses.add(newAddress);
user.addresses.has(newAddress); // true
newAddress.owner == user; // true

user.addresses.delete(newAddress);
user.addresses.has(newAddress); // false
newAddress.owner == user; // false

user.addresses.clear();
user.addresses.size; // 0
```
