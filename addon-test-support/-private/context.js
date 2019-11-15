import { deprecate } from '@ember/application/deprecations';
import { chainable } from './run';

/**
 * @public
 *
 * Render a component's template in the context of a test.
 *
 * Throws an error if a test's context has not been set on the page.
 *
 * Returns the page object, which allows for method chaining.
 *
 * @example
 *
 * page.setContext(this)
 *   .render(hbs`{{my-component}}`)
 *   .clickOnText('Hi!');
 *
 * @param {Object} template - A compiled component template
 * @return {PageObject} - the page object
 */
export function render(template) {
  deprecate('PageObject.render() is deprecated. Please use "htmlbars-inline-precompile" instead.', false, {
    id: 'ember-cli-page-object.page-render',
    until: '2.0.0',
    url: 'https://ember-cli-page-object.js.org/docs/v1.16.x/deprecations/#page-render'
  });

  if (!this.context) {
    let message = 'You must set a context on the page object before calling calling `render()`';
    let error = new Error(message);

    throw error;
  }

  this.context.render(template);

  return this;
}

/**
 * @public
 *
 * Sets the page's test context.
 *
 * Returns the page object, which allows for method chaining.
 *
 * @example
 *
 * page.setContext(this)
 *   .render(hbs`{{my-component}}`)
 *   .clickOnText('Hi!');
 *
 * @param {Object} context - A component integration test's `this` context
 * @return {PageObject} - the page object
 */
export function setContext(context) {
  deprecate('setContext() is deprecated. Please make sure you use "@ember/test-helpers" of v1 or higher.', false, {
    id: 'ember-cli-page-object.set-context',
    until: '2.0.0',
    url: 'https://ember-cli-page-object.js.org/docs/v1.16.x/deprecations/#set-context',
  });

  if (context) {
    this.context = context;

    const chainableNode = chainable(this)
    chainableNode.context = context;
  }

  return this;
}

/**
 * @public
 *
 * Unsets the page's test context.
 *
 * Useful in a component test's `afterEach()` hook, to make sure the context has been cleared after each test.
 *
 * @example
 *
 * page.removeContext();
 *
 * @return {PageObject} - the page object
 */
export function removeContext() {
  if (this.context) {
    delete this.context;

    const chainableNode = chainable(this)
    delete chainableNode.context;
  }

  return this;
}
