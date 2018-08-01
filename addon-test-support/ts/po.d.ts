interface ActionResult {
  then: PromiseLike
  blur(): ActionResult
  focus(): ActionResult
  clickOn(text: string): ActionResult
  click(): ActionResult
  fillIn(contentOrClue: string, value?: string): ActionResult
}

interface A {

}

// interface PO<Def> extends ActionResult, Def {
interface PO<Def> extends ActionResult, Def {
  // [key: string]: any

  isVisible: boolean
  isPresent: boolean
  isHidden: boolean
  isVisible: boolean
  text: string
  value: string
  contains(textToSearch: string): boolean

  readonly [p in Def]: string
}

declare module 'ember-cli-page-object' {
  export function create(definition): PO<typeof definition>;
}
