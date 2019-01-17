import { resolve } from 'rsvp';
import { getExecutionContext } from './execution_context';
import { getRoot, buildPath, isPageObject } from './helpers';

export function run(node, cb) {
  const activity = () => getExecutionContext(node).run(cb);

  let root = getRoot(node);
  if (!isChainedNode(node)) {
    // Store our invocation result on the chained root
    // so that chained calls can find it to wait on it.
    root._chainedTree._promise = activity();

    return chainable(node);
  } else {
    // Already chained, so our root is the root of the chained tree, and we
    // need to wait on its promise if it has one so the previous invocations
    // can resolve before we run ours.
    root._promise = resolve(root._promise).then(activity);

    return node;
  }
}

export function isChainedNode(node) {
  if (!isPageObject(node)) {
    return false;
  }

  let root = getRoot(node);

  return !root._chainedTree;
}

export function chainable(branch) {
    if (isChainedNode(branch)) {
      return branch;
    }

    // See explanation in `create.js` -- here instead of returning the node on
    // which our method was invoked, we find and return our node's mirror in the
    // chained tree so calls to it can be recognized as chained calls, and
    // trigger the chained-call waiting behavior.

    // Collecting node keys to build a path to our node, and then use that
    // to walk back down the chained tree to our mirror node.
    const path = buildPath(branch);

    let node = getRoot(branch)._chainedTree;
    path.forEach((key) => {
      node = getChildNode(node, key)
    });

    return node;
}

function getChildNode(node, key) {
  // Normally an item's key is just its property name, but collection
  // items' keys also include their index. Collection item keys look like
  // `foo[2]` and legacy collection item keys look like `foo(2)`.
  let match;
  if ((match = /\[(\d+)\]$/.exec(key))) {
    // This is a collection item
    let [ indexStr, index ] = match;
    let name = key.slice(0, -indexStr.length);

    return node[name].objectAt(parseInt(index, 10));
  } else if ((match = /\((\d+)\)$/.exec(key))) {
    // This is a legacy collection item
    let [ indexStr, index ] = match;
    let name = key.slice(0, -indexStr.length);

    return node[name](parseInt(index, 10));
  } else {
    return node[key];
  }
}

