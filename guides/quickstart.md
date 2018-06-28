---
layout: page
title: Quickstart
---

{% raw %}

* [Installation](#installation)
* [Search Form](#components)
* [Properties](#properties)
* [Collections](#collections)
* [Application Tests](#application-tests)
* [moduleFor test helpers](#moduleFor-test-helpers)

## Installation

```bash
$ ember install ember-cli-page-object
```

## Component

Suppose we have a very simple search form with an optional `has-error` class in the root:

```html
<form class="has-error">
  <input type="search">

  <button>Search :tada:</button>
</form>
```

Let's generate a dummy component definition:

```bash
$ ember generate page-object-component quick-search

installing
  create tests/pages/components/quick-search.js
```

Now we can descibe the form as follows:

```js
// project-name/tests/pages/components/quick-search.js

import { hasClass } from 'ember-cli-page-object';

export default {
  scope: 'form',

  hasError: hasClass('has-error')

  text: {
    scope: 'input[type="search"]',
  },

  submit: {
    scope: 'button'
  }
};
```

In tests a page object instance should be created from the definition:

```js
import { create } from 'ember-cli-page-object';
import QuickSearch from 'project-name/tests/pages/components/quick-search';

const search = create(QuickSearch);
```

Now we are able to test out form:

```js
test('it renders', async function(assert) {
  await render(`{{quick-search text="some"}}`);

  search.as(s => {
    assert.ok(s.isVisible);
    assert.equal(s.text.value, 'some');
    assert.equal(s.submitBotton.text, 'Search :tada:');
  });
});

test('it requires text on submit', async function(assert) {
  await render(hbs`{{my-search}}`);

  await search.submitButton.click();

  assert.ok(search.hasError)
});
```

# Search list

In order to describe a List of components `collection` should be used:

```js
// project-name/tests/pages/components/awesome-list.js

import { collection } from 'ember-cli-page-object';

export default {
  scope: '.AwesomeList',

  items: collection('.AwesomeList-item', {
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

EmberCLI Page Object collections behave similar to usual JS arrays:

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

## Application Tests

Application tests are not much different from the component tests. The only difference from the EmberCLI Page Object perpective is an availability of a visitable property.

Let's generate a page object containing our `SearchForm` and `AwesomeList` components with an ability to visit a page in the application tests mode:

```bash
$ ember generate page-object search-page

installing
  create tests/pages/search-page.js
```

```js
// project-name/tests/pages/search-page.js

import { create, visitable } from 'ember-cli-page-object';

import SearchForm from './components/search-form';
import AwesomeList from './components/awesome-list';

export default create({
  visit: visitable('/search'),

  scope: '.SearchPage',

  form: SearchForm,

  list: AwesomeList,

  // we can also express a sequence of actions or queries with page object methods
  search(text) {
    await this.form.field.fillIn(text);

    await this.form.submit();
  }
})
```

Now let's write our application test:

```js
import searchPage from 'project-name/tests/pages/search-page';

test('it searches', async function(assert) {
  this.items = this.server.createList('awesome-item', [{
    title: 'Some title'
  }, {
    title: 'Some text'
  }])

  await searchPage.visit();
  await searchPage.search('text');

  assert.equal(searchPage.list.length, 1);
  assert.equal(searchPage.list[0].title, 'Some text');
});
```

{% endraw %}
