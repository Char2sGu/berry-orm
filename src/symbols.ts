/**Build description. */
const d = (s: string) => `berry-orm:${s}`;

export const POPULATED = Symbol(d("populated"));
export const META = Symbol(d("meta"));
