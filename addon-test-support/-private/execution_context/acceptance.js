import $ from '-jquery';
import { run } from '../action';
import { findClosestValue } from '../helpers';
import {
  fillElement,
  assertFocusable
} from './helpers';
import {
  ELEMENT_NOT_FOUND,
  throwBetterError
} from '../better-errors';

export default function AcceptanceExecutionContext(pageObjectNode) {
  this.pageObjectNode = pageObjectNode;
}

AcceptanceExecutionContext.prototype = {
  get testContainer() {
    // @todo: fix usage of private `_element`
    return this.testContext ?
      this.testContext._element :
      '#ember-testing';
  },

  andThen(cb) {
    return window.wait().then(() => {
      cb(this);
    });
  },

  runAsync(cb) {
    return run(this.pageObjectNode, cb);
  },

  visit(path) {
    /* global visit */
    visit(path);
  },

  click(element) {
    /* global click */
    click(element);
  },

  fillIn(element, content) {
    /* global focus */
    focus(element);

    fillElement(element, content);

    /* global triggerEvent */
    triggerEvent(element, 'input');
    triggerEvent(element, 'change');
  },

  triggerEvent(element, eventName, eventOptions) {
    /* global triggerEvent */
    triggerEvent(element, eventName, eventOptions);
  },

  focus(element) {
    assertFocusable(element);

    $(element).focus();
  },

  blur(element) {
    assertFocusable(element);

    $(element).blur();
  },

  assertElementExists(selector, options) {
    /* global find */
    let result = find(selector, options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer'));

    if (result.length === 0) {
      throwBetterError(
        this.pageObjectNode,
        options.pageObjectKey,
        ELEMENT_NOT_FOUND,
        { selector }
      );
    }
  },
};
