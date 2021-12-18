export class PropertyAccessor<
  // eslint-disable-next-line @typescript-eslint/ban-types
  Obj extends object,
  Key extends keyof Obj = keyof Obj,
> {
  value;

  constructor(protected readonly object: Obj, protected readonly key: Key) {
    this.value = object[key];
  }

  apply(): void {
    Reflect.defineProperty(this.object, this.key, {
      configurable: true,
      get: () => this.handleGet(),
      set: (v) => this.handleSet(v),
    });
  }

  handleGet(): Obj[Key] {
    return this.value;
  }

  handleSet(newValue: Obj[Key]): void {
    this.value = newValue;
  }
}
