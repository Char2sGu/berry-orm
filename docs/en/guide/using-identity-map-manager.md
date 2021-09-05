# Using IdentityMapManager

The `IdentityMapManager` instance is provided on the `.imm` property of `BerryOrm` instances. The `IdentityMapManager` is responsible for managing the `IdentityMap` of each type of entity, and the `IdentityMap` is responsible for storing all references of that type of entity.

## Clearing Reference Store

When it comes to a case such as a user logged out, we may need to clear the reference storage to ensure that the user-specific data will not be accidentally leaked.

```ts
orm.imm.clear();
```

The old entities will not be affected, but the subsequent Object Relational Mapping operations will create new entities rather than accessing the old entities.

::: tip

Usually, after clearing the reference store of Berry ORM, you also need to clear your own data store to completely avoid referencing old entities.

:::
