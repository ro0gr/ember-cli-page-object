declare module 'po' {
  export type AsyncPO<T> = KnownActions<T> & UnpackedDefinition<T>
  export type Component<T> = KnownProps<T> & UnpackedDefinition<T>

  export type ActionResult<T> = AsyncPO<T>

  export interface KnownProps<T> extends KnownActions<T> {
    contains(textToSearch: string): boolean
    isVisible: boolean
  }

  interface KnownActions<T> {
    click(this: T): ActionResult<T>
    focus(this: T): ActionResult<T>
  }

  type UnpackedDefinition<T> = {
    [k in keyof T]:
      T[k] extends Definition ?
        T[k] extends Function ? T[k] : Component<T[k]>
      : T[k]
  }

  type Definition = {
    scope?: string
    resetScope?: boolean
  }

  function create<T extends Partial<Definition>>(def: T): Component<T>

  export { create };
}
// type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
