type Proxy<T> = {
  get(): T;
  set(value: T): void;
}
type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
}

namespace GenericPojo {
  type ActionResult = AsyncMethods;

  interface AsyncMethods {
    click(): ActionResult
    focus(): ActionResult
  }

  interface KnownProps extends AsyncMethods {
    contains(textToSearch: string): boolean
    isVisible: boolean
  }

  type iPO<T> = KnownProps & {
    [k in keyof T]:
      T[k] extends Function ? T[k] :
      iPO<T[k]>;
  };

  type Definition = {
    scope: string
  }

  declare function create<T extends Partial<Definition>, S extends keyof T>(def: T): iPO<T>

  const c = {};
  const b = { c }
  const C = d => d;

  const a = create(C({
    scope: 'asdasd',
    c,
    b,
    fly() {
      return "a";
    }
  }));

  // should PASS
  a.isVisible;
  a.click().focus();
  a.b.click()
  a.b.c.click();
  a.fly();
  a.click().b

  // should FAIL
  a.click().isVisible
  a.isVisible.b
  a.isVisible.click();
  a.fly.isVisible
}

  create({
    scope: 13
  })
