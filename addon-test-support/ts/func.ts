type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

const O = {
  a: function(a: number) { return 2 + a},
  b: function(a: number) { return 2 + a},
};
type A = FunctionPropertyNames<typeof O>;

type MyLol<T> = {
  [k in FunctionPropertyNames<T>]: T[k]
}

declare function u<T extends DF>(a: T): MyLol<T>

const t = u(O)

t.a
t.a(2);
t.a(2).toExponential();

t.a();
t.a('asdasd');



type Unpacked<T> =
    T extends (infer U)[] ? U :
    T extends (...args: any[]) => infer U ? U :
    T extends Promise<infer U> ? U :
    T;

type DF = {
  [k: string]: F
}

type F = (...args: any[]) => any

type Proxify<T> = {
  [k in keyof T]: T[k] extends F ? ReturnType<T[k]> : T[k]
}
