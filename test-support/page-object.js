import deprecate from 'ember-cli-page-object/test-support/-private/deprecate';

import {
  alias,
  attribute,
  blurrable,
  clickOnText,
  clickable,
  collection,
  contains,
  count,
  create,
  fillable,
  focusable,
  hasClass,
  is,
  isHidden,
  isPresent,
  isVisible,
  notHasClass,
  property,
  text,
  triggerable,
  value,
  visitable
} from 'ember-cli-page-object';

export {
  alias,
  attribute,
  clickOnText,
  clickable,
  collection,
  contains,
  count,
  create,
  fillable,
  fillable as selectable,
  focusable,
  hasClass,
  is,
  isHidden,
  isPresent,
  isVisible,
  notHasClass,
  property,
  text,
  triggerable,
  value,
  visitable
};

export default {
  alias,
  attribute,
  blurrable,
  clickOnText,
  clickable,
  collection,
  contains,
  count,
  create,
  fillable,
  focusable,
  hasClass,
  is,
  isHidden,
  isPresent,
  isVisible,
  notHasClass,
  property,
  selectable: fillable,
  text,
  triggerable,
  value,
  visitable
};

export { buildSelector, findElementWithAssert, findElement, getContext, fullScope } from 'ember-cli-page-object';

deprecate(
  'import-from-test-support',
  `Importing from "test-support" is now deprecated. Please import directly from the "ember-cli-page-object" module instead.`,
  '1.16.0',
  '2.0.0',
)
