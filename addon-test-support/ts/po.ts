declare module 'ember-cli-page-object' {
  type AsyncPO<T> = KnownActions<T> & UnpackedDefinition<T>

  export type ActionResult<T> = AsyncPO<T>

  interface KnownProps<T> extends KnownActions<T> {
    contains(textToSearch: string): boolean
    isVisible: boolean
  }

  type BoundFunction<T, K extends Function> = (this: T, ...args: any[]) => K

  type ActionInstance<T> = (this: T, ...args: any[]) => ActionResult<T>

  interface KnownActions<T> {
    click(this: T): ActionResult<T>
    focus(this: T): ActionResult<T>
  }

  type aFunc = (...args: any[]) => any

  type UnpackedDefinition<T> = {
    [k in keyof T]:
      T[k] extends string ? T[k] // Component<T[k]>
      : T[k] extends boolean ? T[k] // Component<T[k]>
      : T[k] extends number ? T[k] // Component<T[k]>
      : T[k] extends aFunc
        ? ReturnType<T[k]> extends ActionResult<T> ? ActionInstance<Component<T>> : T[k]
      //   ReturnType<T[k]> extends ActionResult<T> ? ActionInstance<Component<T>>
      //   : T[k]
      : T[k] extends Definition ? Component<T[k]>
      : T[k]
      // : never
  }

  type Definition = {
    scope?: string
    resetScope?: boolean
  }

  function create<T extends Partial<Definition>>(def: T): Component<T>
  function clickable<T>(): () => ActionResult<T>

  export type Component<T> = KnownProps<T> & UnpackedDefinition<T>
  export { clickable, create }
}
