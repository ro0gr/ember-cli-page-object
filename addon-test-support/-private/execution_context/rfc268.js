import $ from '-jquery';
import { run } from '../action';
import {
  guardMultiple,
  buildSelector,
  findClosestValue,
} from '../helpers';
import {
  getContext,
  visit,
  click,
  fillIn,
  triggerEvent,
  triggerKeyEvent,
  focus,
  blur
} from '../compatibility';
import {
  ELEMENT_NOT_FOUND,
  throwBetterError
} from '../better-errors';

export default function ExecutionContext(pageObjectNode) {
  this.pageObjectNode = pageObjectNode;
}

ExecutionContext.prototype = {
  run(cb) {
    return cb(this);
  },

  // @todo: deprecate me
  runAsync(cb) {
    return run(this.pageObjectNode, cb);
  },

  visit(path) {
    return visit(path);
  },

  click(selector, container, options) {
    return this.invokeHelper(selector, options, click);
  },

  fillIn(selector, container, options, content) {
    return this.invokeHelper(selector, options, fillIn, content);
  },

  triggerEvent(element, eventName, eventOptions) {
    if (typeof eventOptions.key !== 'undefined' || typeof eventOptions.keyCode !== 'undefined') {
      const key = eventOptions.key || eventOptions.keyCode;

      return triggerKeyEvent(element, eventName, key, eventOptions);
    }

    return triggerEvent(element, eventName, eventOptions);
  },

  focus(element) {
    return focus(element);
  },

  blur(element) {
    return blur(element);
  },

  assertElementExists(selector, options) {
    let result = this.getElements(selector, options);

    if (result.length === 0) {
      throwBetterError(
        this.pageObjectNode,
        options.pageObjectKey,
        ELEMENT_NOT_FOUND,
        { selector }
      );
    }
  },

  find(selector, options) {
    selector = buildSelector(this.pageObjectNode, selector, options);
    let result = this.getElements(selector, options);

    guardMultiple(result, selector, options.multiple);

    return result;
  },

  findWithAssert(selector, options) {
    selector = buildSelector(this.pageObjectNode, selector, options);
    let result = this.getElements(selector, options);

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
  },

  getElements(selector, options) {
    let container = options.testContainer || findClosestValue(this.pageObjectNode, 'testContainer');
    if (container) {
      return $(selector, container);
    } else {
      return $(selector, getContext().element);
    }
  },

  invokeHelper(selector, options, helper, ...args) {
    let element = this.getElements(selector, options)[0];
    return helper(element, ...args).catch((e) => {
      throwBetterError(
        this.pageObjectNode,
        options.pageObjectKey,
        e.message || e.toString(),
        { selector }
      );
    });
  }
};
