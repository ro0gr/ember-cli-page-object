import { resolve } from 'rsvp';
import { findElementWithAssert } from 'ember-cli-page-object/extend';
import run from '../-private/run';
import { throwBetterError } from '../-private/better-errors';

export default function action(node, selector, query, cb) {
  if (!query.key) {
    throw new Error(`Query key must be present`);
  }

  const domElement = findElementWithAssert(node, selector, query).get(0);

  const onFailure = (e) => throwBetterError(node, query.key, e, { selector });

  let asyncResult;
  try {
    asyncResult = run(this, () => {
      return cb(domElement);
    });
  } catch (e) {
    onFailure(e);
  }

  return asyncResult && asyncResult.then
    ? asyncResult.catch(onFailure)
    : resolve(asyncResult);
}
