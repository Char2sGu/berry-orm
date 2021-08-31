export interface Type<T = unknown> {
  new (...args: any[]): T;
  prototype: T;
}
