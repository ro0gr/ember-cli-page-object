import $ from '-jquery';
import { run } from '@ember/runloop';
import { run as runAction } from '../action';
import {
  guardMultiple,
  buildSelector,
  findClosestValue
} from '../helpers';
import {
  fillElement,
  assertFocusable
} from './helpers';
import {
  ELEMENT_NOT_FOUND,
  throwBetterError
} from '../better-errors';

export default function IntegrationExecutionContext(pageObjectNode, testContext) {
  this.pageObjectNode = pageObjectNode;
  this.testContext = testContext;
}

IntegrationExecutionContext.prototype = {
  run(cb) {
    run(() => {
      cb(this);
    });
  },

  runAsync(cb) {
    return runAction(this.pageObjectNode, cb);
  },

  visit() {},

  click(element) {
    $(element).click();
  },

  fillIn(element, content) {
    fillElement(element, content);

    $(element).trigger('input');
    $(element).change();
  },

  $(selector, container) {
    if (container) {
      return $(selector, container);
    } else {
      return this.testContext.$(selector);
    }
  },

  triggerEvent(element, eventName, eventOptions) {
    let event = $.Event(eventName, eventOptions);

    $(element).trigger(event);
  },

  focus(element) {
    assertFocusable(element);

    $(element).focus();
  },

  blur(element) {
    assertFocusable(element);

    $(element).blur();
  },

  find(selector, options) {
    let result;
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');

    selector = buildSelector(this.pageObjectNode, selector, options);

    if (container) {
      result = $(selector, container);
    } else {
      result = this.testContext.$(selector);
    }

    guardMultiple(result, selector, options.multiple);

    return result;
  },

  findWithAssert(selector, options) {
    let result;
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');

    selector = buildSelector(this.pageObjectNode, selector, options);

    if (container) {
      result = $(selector, container);
    } else {
      result = this.testContext.$(selector);
    }

    guardMultiple(result, selector, options.multiple);

    if (result.length === 0) {
      throwBetterError(
        this.pageObjectNode,
        options.pageObjectKey,
        ELEMENT_NOT_FOUND,
        { selector }
      );
    }

    return result;
  }
};
