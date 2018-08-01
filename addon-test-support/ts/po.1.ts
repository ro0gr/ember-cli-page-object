type _ActionResult<T> = {
  'then': PromiseLike<T>

  blur(): _ActionResult<T>
  focus(): _ActionResult<T>
  clickOn(text: string): _ActionResult<T>
  click(): _ActionResult<T>
  fillIn(): _ActionResult<T>
}

type _ActionWrapper<T> = { (this: T): _Action<typeof this> }
type _Action<T> = { (this: T): _ActionResult<typeof this> }

// interface _clickable { (selector?: string): Action<this> }
// declare var clickable: _clickable;

interface _CustomDefType {
  [key: string]: _Action<this>
}

type _PO<T extends _CustomDefType> = {
  [ key in keyof T ]: _ActionWrapper<_PO<T>>
}

declare var clickable: ActionWrapper;
// declare function clickable<T> (selector?: string): Action<T>;

declare function create<T extends (_CustomDefType)> (def: T)
  : _PO<T>

// declare function clickable<T extends PO<object>>(selector: string): Action<T>;

var b = create({
  clickMe: clickable(),
});

b.clickMe();
// export const d = {
//   elements: [
//     'username',
//     'gender',
//     'age'
//   ],

//   submit: '[type="submit"]'
// };

// const p = create(d);

