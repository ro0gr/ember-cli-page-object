type ActionResult<T> = {
  'then': PromiseLike<T>

  blur(): ActionResult<T>
  focus(): ActionResult<T>
  clickOn(text: string): ActionResult<T>
  click(): ActionResult<T>
  fillIn(): ActionResult<T>
}

type ActionWrapper<T> = { (this: T): Action<T> }
type Action<T> = { (): ActionResult<T> }

// interface _clickable { (selector?: string): Action<this> }
// declare var clickable: _clickable;

type DefType = { [key: string]: any }

type PO<T extends DefType> = {
  [ key in keyof T ]: PO<T[key]>
}

interface CustomDefType {
  [key: string]: Action<this>
}

type CustomPO<T extends CustomDefType> = {
  [ key in keyof T ]: ActionWrapper<PO<T[key]>>
}

// declare var clickable: ActionWrapper;
// declare function clickable<T> (selector?: string): Action<T>;

declare function create<T extends (DefType|CustomDefType)> (def: T)
  : PO<T>
  | CustomPO<T>

// declare function clickable<T extends PO<object>>(selector: string): Action<T>;

const a = create({
  clickMe: clickable(),
  b: {
    scope: 'asdasd'
  }
});

a.clickMe()
// export const d = {
//   elements: [
//     'username',
//     'gender',
//     'age'
//   ],

//   submit: '[type="submit"]'
// };

// const p = create(d);

