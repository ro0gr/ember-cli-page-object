---
layout: page
title: Quickstart
---

{% raw %}

## Installation

```bash
$ ember install ember-cli-page-object
```

## Components

Components are the main building blocks in the EmberCLI Page Object. You can create one by running a component generator:

```bash
$ ember generate page-object-component search-form

installing
  create tests/pages/components/search-form.js
```

Each component requires a css `scope` to be definied:

```js
// project-name/tests/pages/components/search-form.js

export default {
  scope: 'form.SearchForm',

  input: {
    scope: 'input.[data-test-input-field]'
  },

  submitButton: {
    scope: 'button'
  }
}
```

Each component is supplied with a list of default properties and actions which can be used right after the page object instance is created:

```js
import { create } from 'ember-cli-page-object';
import SearchForm from 'project-name/tests/pages/components/search-form';

const searchForm = create(SearchForm);

test('it renders', async function(assert) {
  await render(`{{search-form}}`);

  assert.ok(searchForm.isVisible);
});

test('it can submit', async function(assert) {
  let actualText;
  this.onSubmit = (searchText) => { actualText = searchText; }

  await render(`{{search-form onSubmit=(action this.onSubmit)}}`);

  await searchForm.input.fillIn('search text');
  await searchForm.submitButton.click();

  assert.equal(actualText, 'search text')
});
```

In order to describe a list of components a `collection` should be used:

```js
// project-name/tests/pages/components/awesome-list.js

import { collection } from 'ember-cli-page-object';

export default {
  scope: '.AwesomeList',

  items: collection('.AwesomeItem', {
    title: {
      scope: '.AwesomeItem-title'
    },

    badges: collection('.AwesomeBadges'),

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
  this.items = this.server.createList('awesome-item', [{
    title: 'Some title'
  }])

  await render(`{{awesome-list items=this.items}}`);

  assert.equal(awesomeList.items.length, 1);
  assert.equal(awesomeList.items[0].title, 'Some title');

  assert.ok(awesomeList.items[0].updatedAt.isVisible);
});
```

By composing components and collections together you can describe very complex components hierarchies.


{% endraw %}
