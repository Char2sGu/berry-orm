export type Type<T = unknown, Parameters extends any[] = any[]> = {
  new (...args: Parameters): T;
  prototype: T;
};
