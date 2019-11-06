import {
  click,
  triggerEvent,
  keyEvent,
  focus,
  blur
} from 'ember-native-dom-helpers';

import run from '../run';
import {
  fillElement,
  assertFocusable
} from './helpers';

const KEYBOARD_EVENT_TYPES = ['keydown', 'keypress', 'keyup'];

export default function ExecutionContext(pageObjectNode, testContext) {
  this.pageObjectNode = pageObjectNode;
  this.testContext = testContext;
}

ExecutionContext.prototype = {
  get testContainer() {
    // @todo: fix usage of private `_element`
    return this.testContext ?
      this.testContext._element :
      '#ember-testing';
  },

  runAsync(cb) {
    return run(this.pageObjectNode, cb);
  },

  click(el) {
    click(el);
  },

  fillIn(element, content) {
    fillElement(element, content);

    triggerEvent(element, 'input');
    triggerEvent(element, 'change');
  },

  triggerEvent(element, eventName, eventOptions) {
    // `keyCode` is a deprecated property.
    // @see: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // Due to this deprecation `ember-native-dom-helpers` doesn't accept `keyCode` as a `KeyboardEvent` option.
    if (typeof eventOptions.key === 'undefined' && typeof eventOptions.keyCode !== 'undefined') {
      eventOptions.key = eventOptions.keyCode.toString();
      delete eventOptions.keyCode;
    }

    if (KEYBOARD_EVENT_TYPES.indexOf(eventName) > -1) {
      keyEvent(element, eventName, eventOptions.key, eventOptions);
    } else {
      triggerEvent(element, eventName, eventOptions);
    }
  },

  focus(element) {
    assertFocusable(element);

    focus(element);
  },

  blur(element) {
    assertFocusable(element);

    blur(element);
  },
};

