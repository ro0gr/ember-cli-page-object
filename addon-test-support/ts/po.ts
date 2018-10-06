namespace PO {
  type ActionResult<T> = KnownActions<any> & {
    'then': PromiseLike<T>
  };

  interface KnownActions<T> {
    click(): ActionResult<T>
    focus(): ActionResult<T>
  }

  interface KnownProps<T> extends KnownActions<T> {
    contains(textToSearch: string): boolean
    isVisible: boolean
  }

  type iPO<T> = KnownProps<T> & MyLol<T> & {
    [k in keyof T]:
      T[k] extends Definition ? iPO<T[k]> : T[k]
  }

  type Definition = {
    scope: string
  }

  export declare function create<T extends Partial<Definition>>(def: T): iPO<T>
}
// type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
