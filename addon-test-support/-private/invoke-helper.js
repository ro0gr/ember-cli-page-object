import { resolve } from 'rsvp';
import { findElementWithAssert } from 'ember-cli-page-object/extend';
import { throwBetterError } from './better-errors';

export default function invokeHelper(node, selectorOrHelper, query, helper) {
  const domElement = findElementWithAssert(node, selectorOrHelper, query).get(0)
  const onFailure = (e) => throwBetterError(node, query.pageObjectKey, e, { selector: selectorOrHelper })

  let asyncResult;
  try {
     asyncResult = helper(domElement);
  } catch (e) {
    onFailure(e)
  }

  return asyncResult && asyncResult.then
    ? asyncResult.catch(onFailure)
    : resolve(asyncResult);
}
