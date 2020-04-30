import $ from '-jquery';
import {
  buildSelector,
  findClosestValue,
  guardMultiple
} from '../-private/helpers';
import { getExecutionContext } from '../-private/execution_context';
import { throwBetterError, ELEMENT_NOT_FOUND } from './better-errors';

function getContainer(pageObjectNode, options) {
  return options.testContainer
    || findClosestValue(pageObjectNode, 'testContainer')
    || getExecutionContext(pageObjectNode).testContainer;
}

/**
 * @private
 */
export function findOne(pageObjectNode, targetSelector, options = {}) {
  const selector = buildSelector(pageObjectNode, targetSelector, options);
  const container = getContainer(pageObjectNode, options);

  const elements = $(selector, container).toArray();

  guardMultiple(elements, selector);

  if (elements.length === 0) {
    throwBetterError(
      pageObjectNode,
      options.pageObjectKey,
      ELEMENT_NOT_FOUND,
      { selector }
    );
  }

  return elements[0];
}

/**
 * @private
 */
export function findMany(pageObjectNode, targetSelector, options = {}) {
  const selector = buildSelector(pageObjectNode, targetSelector, options);
  const container = getContainer(pageObjectNode, options);

  return $(selector, container).toArray();
}

/**
 * @private
 * @deprecated
 */
export function findElementWithAssert(pageObjectNode, targetSelector, options = {}) {
  const selector = buildSelector(pageObjectNode, targetSelector, options);
  const container = getContainer(pageObjectNode, options);

  let $elements = $(selector, container);

  guardMultiple($elements, selector, options.multiple);

  if ($elements.length === 0) {
    throwBetterError(
      this.pageObjectNode,
      options.pageObjectKey,
      ELEMENT_NOT_FOUND,
      { selector }
    );
  }

  return $elements;
}

/**
 * @private
 * @deprecated
 */
export function findElement(pageObjectNode, targetSelector, options = {}) {
  const selector = buildSelector(pageObjectNode, targetSelector, options);
  const container = getContainer(pageObjectNode, options);

  let $elements = $(selector, container);

  guardMultiple($elements, selector, options.multiple);

  return $elements;
}
