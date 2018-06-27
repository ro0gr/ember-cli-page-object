## Using moduleFor test helpers

In general EmberCLI Page Object definitions can be used accross the different test types and different test-helpers implementations without any page object definitions changes required.
However there is a caveat with a `moduleForComponent`. In order to instruct EmberCLI Page Object to enable `moduleForComponent` mode you should use `setupContext` on your page object:

```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import form from 'project-name/tests/pages/components/search-form';

moduleForComponent('AwesomeList', 'Integration | AwesomeList', {
  integration: true,

  beforeEach() {
    page.setContext(this);
  },

  afterEach() {
    page.removeContext();
  }
});


test('it renders', function(assert) {
  this.items = [
    this.store.createRecord('awesome-item', {
      title: 'Some title'
    })
  ];

  render(`{{awesome-list items=this.items}}`);

  assert.equal(awesomeList.items.length, 1);
  assert.equal(awesomeList.items[0].title.text, 'Some title');
}

```
