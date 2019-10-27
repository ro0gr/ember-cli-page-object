import { findElementWithAssert } from 'ember-cli-page-object/extend';
import run from '../-private/run';
import { throwBetterError } from '../-private/better-errors';

export default function action(node, selector, query, cb) {
  const domElements = findElementWithAssert(node, selector, Object.assign({
    multiple: true
  }, query)).get();

  return domElements.reduce((node, domElement) => {
    return run(node, () => {
      return cb(domElement);
    });
  }, node).then(undefined, (e) => {
    return throwBetterError(node, query.pageObjectKey, e, { selector })
  });
}
