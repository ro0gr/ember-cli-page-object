import { fixture } from './acceptance-adapter';
export { moduleForComponent as moduleForIntegration, test as testForIntegration } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import Ember from 'ember';

export function IntegrationAdapter(context) {
  this.context = context;
}

IntegrationAdapter.prototype = {
  name: 'integration',

  $(selector, isAlternative) {
    return Ember.$(selector, isAlternative ? '#alternate-ember-testing' : '#ember-testing');
  },

  revert() {},

  createTemplate(test, page, template, options) {
    template = template || '';

    if (!(test && page)) {
      // eslint-disable-next-line no-console
      console.error('Missing parameters in adapter.createTemplate(testContext, pageObject, templateString)');
    }

    if (options && options.useAlternateContainer) {
      // The idea is to render the HTML outside the testing container so we
      // render an empty component
      fixture(template, options);
      test.set('raw', '');
    } else {
      test.set('raw', template);
    }

    page.setContext(test);

    this.context.render(hbs`{{html-render html=raw}}`);
  },

  throws(assert, block, expected, message) {
    Ember.run(() => {
      assert.throws(block, expected, message);
    });
  },

  andThen(fn) {
    fn();
  },

  wait() {}
};
