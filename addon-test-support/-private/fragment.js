import { as } from '../properties/as';
import { blurrable } from '../properties/blurrable';
import { clickable } from '../properties/clickable';
import { clickOnText } from '../properties/click-on-text';
import { contains } from '../properties/contains';
import { fillable } from '../properties/fillable';
import { focusable } from '../properties/focusable';
import { isHidden } from '../properties/is-hidden';
import { isPresent } from '../properties/is-present';
import { isVisible } from '../properties/is-visible';
import { text } from '../properties/text';
import { value } from '../properties/value';

import { getRoot } from './helpers';
import { wait } from './compatibility';

export default class Fragment {
  constructor() {
    this.as = as;
    this.blur = blurrable(),
    this.click = clickable(),
    this.clickOn = clickOnText(),
    this.contains = contains(),
    this.fillIn = fillable(),
    this.focus = focusable(),
    this.isHidden = isHidden(),
    this.isPresent = isPresent(),
    this.isVisible = isVisible(),
    this.select = fillable(),
    this.text = text(),
    this.value = value()

    this.then = {
      isDescriptor: true,

      value() {
        // In RFC268 tests, we need to wait on the promise returned from the actual
        // test helper, rather than a global method such as `wait`. So, we store the
        // promise on the root of the (chained) tree so we can find it here and use
        // it.
        let promise = getRoot(this)._promise;
        if (!promise) {
          promise = (window.wait || wait)();
        }

        return promise.then(...arguments);
      }
    }
  }
}
