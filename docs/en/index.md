---
home: true
heroText: Berry ORM
tagline: Strictly typed lightweight object-relational mapper for Node.js and browsers.
actionText: Getting Started →
actionLink: ./guide/introduction
features:
  - title: Strictly Typed
    details: Enjoy the pleasant development experience brought by the extremely strict types, and maximize the advantages of TypeScript.
  - title: Lightweight and Generic
    details: Just object-relational mapping, no extra features, can be used in any scenario.
  - title: Easy to Use
    details: Full control over object relations with simple assignments and calls.
---

## Entity Definition

```ts {6,10,14,19,24,28}
@Entity()
export class User extends BaseEntity<User, "id"> {
  // primary field
  @Primary()
  @Field()
  id!: number;

  // data field
  @Field()
  firstName!: string;

  // data field
  @Field()
  lastName!: string;

  // to-one relation field
  @Relation({ target: () => Profile, inverse: "owner" })
  @Field()
  profile?: Profile;

  // to-many relation field
  @Relation({ target: () => User, inverse: "friends", multi: true })
  @Field()
  friends!: Collection<User>;

  // data field
  @Field()
  joinedAt!: Date;

  // custom accessor
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // custom method
  capitalize() {
    this.firstName.toUpperCase();
    this.lastName.toUpperCase();
  }
}
```

## Data to Entity

```ts
const user = orm.em.populate(
  User,
  {
    id: 1,
    firstName: "Gu",
    lastName: "Charles",
    profile: 1,
    friends: [
      2, // foreign key
      { id: 3 /* , ... */ }, // nested data object
    ],
    joinedAt: new Date().toISOString(), // both `string` and `Date` is acceptable because the `DateSerializer` is applied
  },
  {
    joinedAt: DateSerializer, // support more flexible input value for the field `joinedAt`
  },
);
```

## Entity to Data

```ts
const data = orm.em.export(
  user,
  {
    profile: true, // export `.profile` as a nested data object
    friends: { profile: true }, // nesting supported
  },
  {
    joinedAt: DateSerializer, // make `user.joinedAt` be exported as a `string` rather than a `Date`
  },
);
```
