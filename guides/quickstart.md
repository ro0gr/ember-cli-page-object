---
layout: page
title: Quickstart
---

{% raw %}

## Installation

```bash
$ ember install ember-cli-page-object
```

## Declating components

Components are the main building blocks in the EmberCLI Page Object. You can create one by running a component generator:

```bash
$ ember generate page-object-component search-form

installing
  create tests/pages/components/search-form.js
```

The only required component option is a css `scope`:

```js
// project-name/tests/pages/components/search-form.js

export default {
  scope: 'form.SearchForm',

  field: {
    scope: '[data-test-search-field]',
    
    input: {
      scope: 'input'
    },
  },

  submitButton: {
    scope: 'button'
  }
}
```

Scopes allows us to query a DOM via Page Object interface. Right after a component creation you can access a set of actions and properties provided by [default](./api/components#default-attributes).

```js
import { create } from 'ember-cli-page-object';
import SearchForm from 'project-name/tests/pages/components/search-form';

const searchForm = create(SearchForm);

test('it submits', async function(assert) {
  // @todo: use sinon or testdouble
  let actualText;
  this.onSubmit = (searchText) => { actualText = searchText; }

  await render(`{{search-form onSubmit=(action this.onSubmit)}}`);

  assert.ok(searchForm.isVisible);

  await searchForm.field.input.fillIn('search text');
  await searchForm.submitButton.click();

  assert.equal(actualText, 'search text')
});
```

## Customizing Components

Components can be extended w
You can also configure properties in order to hide a page object hierarchy complexity:

```js
import {
  attribute,
  fillable,
  clickable,
  hasClass
} from 'ember-cli-page-object';

export default {
  scope: 'form.SearchForm',
  
  field: {
    scope: '[data-test-search-field]',
    
    fillIn: fillable('input'),

    isFocused: hasClass('has-focus')

    isDisabled: attribute('disabled')
  },

  submit: clickable('button')
}
```

Then the previous test can be re-written as:

```js
test('it submits', async function(assert) {
  let actualText;
  this.onSubmit = (searchText) => { actualText = searchText; }

  await render(`{{search-form onSubmit=(action this.onSubmit)}}`);

  // Fill in "form.SearchForm [data-test-search-field] input" element
  await searchForm.field.fillIn('search text');

  // click "form.SearchForm button" element
  await searchForm.submit();

  assert.equal(actualText, 'search text')
});
```

## Collections


In order to describe a List of components `collection` should be used:

```js
// project-name/tests/pages/components/awesome-list.js

import { collection } from 'ember-cli-page-object';

export default {
  scope: '.AwesomeList',

  items: collection('.AwesomeItem', {
    title: {
      scope: '.AwesomeItem-title'
    },

    badges: collection('ul.AwesomeBadges li'),

    updatedAt: {
      scope: '.AwesomeItem-lastUpdated'
    }
  })
}
```

EmberCLI Page Object collections behave similar to a usual JS Arrays:

```js
import { create } from 'ember-cli-page-object';
import AwesomeList from 'project-name/tests/pages/components/awesome-list';

const awesomeForm = create(AwesomeList);

test('it renders', async function(assert) {
  this.items = [
    await run(() => this.store.createRecord('awesome-item', {
      title: 'Some title'
    }))
  ];

  await render(`{{awesome-list items=this.items}}`);

  assert.equal(awesomeList.items.length, 1);
  assert.equal(awesomeList.items[0].title.text, 'Some title');
});
```


{% endraw %}
