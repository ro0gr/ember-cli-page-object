import Ember from 'ember';
import {
  moduleForIntegration as moduleForComponent,
  testForIntegration as test
} from 'dummy/tests/helpers/properties/integration-adapter';
import { createCalculatorTemplate } from './test-helper';

import PageObject from 'ember-cli-page-object';

if (Ember.hasOwnProperty('$')) {
  moduleForComponent('calculating-device', 'Integration | context', {
    integration: true
  });

  test('Test\'s `this` context\'s methods are accessible to the page object', function(assert) {
    assert.expect(2);

    let page = PageObject.create({
      context: this
    });

    assert.ok(page.context);

    assert.deepEqual(this, page.context);
  });

  test('Test\'s `this.$()` is accessible by the page object', function(assert) {
    assert.expect(2);

    let page = PageObject.create({
      context: this
    });

    this.render(createCalculatorTemplate());

    assert.ok(page.context.$());
    assert.deepEqual(page.context.$(), this.$());
  });

  test('`setContext(this)` and `removeContext()` set and remove the test context from the page', function(assert) {
    assert.expect(3);

    let page = PageObject.create({});

    assert.notOk(page.context);

    page.setContext(this);

    assert.deepEqual(page.context, this);

    page.removeContext();

    assert.notOk(page.context);
  });

  test('`render()` throws an error when no context has been set', function(assert) {
    assert.expect(2);

    let errorMessage;

    let page = PageObject.create({});

    assert.notOk(page.context);

    assert.throws(function() {
      page.render(createCalculatorTemplate());
    }, function(err) {
      errorMessage = err.message;

      return errorMessage === 'You must set a context on the page object before calling calling `render()`';
    }, `render did not throw an error when no context was set. Actual message: ${errorMessage}`);
  });
}
