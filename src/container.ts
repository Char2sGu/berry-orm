import { Type } from "./utils/type.type";

const map = new Map<Type, unknown>();

export const container = {
  get<T>(type: Type<T>) {
    let instance = map.get(type);
    if (!instance) {
      instance = new type();
      map.set(type, instance);
    }
    return instance as T;
  },
};
