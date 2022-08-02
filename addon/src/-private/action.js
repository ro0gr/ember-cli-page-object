import { getter } from '../macros/index';
import { buildSelector } from './helpers';
import { run } from './run';

export default function action(options, cb) {
  return getter(function (key) {
    return function (...args) {
      ({ options, cb } = normalizeArgs(key, options, cb, args));

      const node = this;
      return run({
        node,
        filters: {
          ...options,
        },
        toString() {
          return buildSelector(node, options.selector, options)
        }
      }, () => {
        return cb.bind(this)(...args);
      });
    };
  });
}

function normalizeArgs(key, options, cb, args) {
  const formattedKey = `${key}(${
    args.length ? `"${args.map((a) => String(a)).join('", "')}"` : ``
  })`;

  if (typeof options === 'function') {
    cb = options;
    options = {
      pageObjectKey: formattedKey,
    };
  } else {
    options = {
      ...options,
      pageObjectKey: formattedKey,
    };
  }

  return { options, cb };
}
