# Entity Events

We can listen for entity events through the `orm.eem`. (`eem` means `EntityEventManager`).

All event listeners will be removed after invoking `orm.reset()`.

| Event       | Timing                                                      |
| ----------- | ----------------------------------------------------------- |
| `"resolve"` | Called after resolved using `orm.resolve()`                 |
| `"update"`  | Called after resolved and any field is assigned a new value |

## Listening for Events

We can use `orm.eem.on()` or `orm.eem.once()` to listen for events. The entity which triggered the event will be passed to event listeners.

The event target can be:

- A specific entity
- Entities of a specific entity class
- Any entities

```ts
orm.eem.on(book, "update", (book) => console.debug(book));
orm.eem.on(Book, "update", (book) => console.debug(book));
orm.eem.on("any", "update", (book) => console.debug(book));
```

## Removing Event Listeners

We can remove:

- A specific event listener of a specific event of a specific event target.
- All event listeners of a specific event of a specific event target.
- All event listeners of a specific event target.
- All event listeners.

```ts
orm.eem.off(book, "update", callback);
orm.eem.off(Book, "update", callback);
orm.eem.off("any", "update", callback);

orm.eem.off(book, "update");
orm.eem.off(Book, "update");
orm.eem.off("any", "update");

orm.eem.off(book);
orm.eem.off(Book);
orm.eem.off("any");

orm.eem.off();
```
