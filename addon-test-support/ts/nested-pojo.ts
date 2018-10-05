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
    [k in keyof T]: iPO<T[k]>
  };

  declare function create<T, S extends keyof T>(def: T): iPO<T>

  const c = {};
  const b = { c }
  const C = d => d;

  const a = create(C({ c, b }));

  // should PASS
  a.isVisible;
  a.click().focus();
  a.b.click()
  a.b.c.click();

  // should FAIL
  a.click().b
  a.click().isVisible
  a.isVisible.b
  a.isVisible.click();
}
