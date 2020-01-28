export const assert = (message, condition) => {
  if (!condition) {
    throw new Error(message);
  }
}

export const get = (c, k) => {
  throw new Error('not implemented');
}

export const isPresent = (c) => {
  return typeof c !== 'undefined';
}

export const assign = (...args) => {
  return Object.assign(...args);
}

export const deprecate = (...args) => {
  console.warn('deprecation', ...args);
}

export const warn = (...args) => {
  console.warn('warn', ...args);
}

export const A = (a) => {
  return a;
}
