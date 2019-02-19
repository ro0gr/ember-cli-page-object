import { buildSelector } from '../../-private/helpers';
import { findElement } from '../../extend';

export function childSelector(pageObject, selector, options) {
  const selectorWithSpace = `${selector || ''} `;

  if (findElement(pageObject, selectorWithSpace, options).length) {
    return buildSelector(pageObject, selectorWithSpace, options);
  } else {
    return buildSelector(pageObject, selector, options);
  }
}
