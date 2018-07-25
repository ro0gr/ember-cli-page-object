---
layout: page
title: Quickstart
---

{% raw %}

This is a short guide to get you started testing your applications with EmberCLI Page Object.

Let's consider a search page with the following markup:

```html
<section class="SearchPage">

  <!-- {{search-form text=this.text}} -->
  <form>
    <input type="search">

    <button>Search</button>
  </form>

  <!-- {{search-results items=this.items}} -->
  <ul>
    <li>
      <h5>Title #1...</h5>
      <p>Description here...</p>
    </li>
    <li>
      <h5>Title #2...</h5>
      <p>Description here...</p>
    </li>
  </ul>

</section>
```

Here is how an application test for this page might look:

```js
test('it searches', async function(assert) {
  this.server.createList('my-model', [
    { title: 'Awesome Title' },
    { title: 'Another Title' }
  ])

  await visit('/search');
  await fillIn('.SearchPage form [type=search]', 'some');
  await click('.SearchPage form button');

  assert.dom('.SearchPage ul li').exists({ count: 1 });
  assert.dom('.SearchPage ul li h5').hasText('Awesome Title');
});
```

Whilst the markup is pretty simple we can see a mix of `search-form` and `search-results` components with their own DOM structures and interaction specifics which may make maintainability of your tests a challenge when it comes to a more complex pages or large test suites. 

With page objects you can break a complex UI into a smaller manageable components with nice APIs and composability capabilities.

## Component

First let's see how to define a `search-form` with a page object.

```html
<form>
  <input type="search">

  <button>Search</button>
</form>
```

To generate component definitions you can use a corresponding component generator:

```bash
$ ember generate page-object-component search-form

installing
  create tests/pages/components/search-form.js
```

With page objects `search-form` component can be described as follows:

```js
// project-name/tests/pages/components/search-form.js

import { clickable } from 'ember-cli-page-object';

export default {
  scope: 'form',

  text: {
    scope: 'input[type="search"]',
  },

  submit: clickable('button')
};
```

A plain object with a `scope` attribute provided is a component definition. It means the `text` attribute does also contain a component definition.

Let's see how to use our fresh definition in component tests:

```js
// tests/integration/search-form-test.js

import { create } from 'ember-cli-page-object';
import SearchForm from 'project-name/tests/pages/components/search-form';

// Create a component from the definition
const search = create(SearchForm);

test('it renders', async function(assert) {
  await render(`{{search-form}}`);

  // "isVisible" is a default component attribute
  assert.ok(search.isVisible);
});

test('it renders with a search text', async function(assert) {
  await render(`{{search-form text="some"}}`);

  // "value" is a default component attribute
  assert.equal(search.text.value, 'some');
});

test('it submits search text', async function(assert) {
  this.onSubmit = (text) => {
    assert.equal(text, 'Search Text');
  }

  await render(hbs`{{my-search onSubmit=(action onSubmit)}}`);

  // "fillIn" is a default component action
  await search.text.fillIn('Search Text');

  await search.submit();
});
```

## Collection

```html
<ul>
  <li>
    <h5>Title #1...</h5>
    <p>Description here...</p>
  </li>
</ul>
```

```bash
$ ember generate page-object-component search-form
```

```js
// project-name/tests/pages/components/search-item.js
export default {
  scope: 'li',

  title: {
    scope: 'h5'
  },

  description: {
    scope: 'p'
  }
}
```

## Application tests

Now let's test a search page which includes a `SearchForm` form from the previous example and a simple results list:

```html
<section class="SearchPage">
  <form>
    <input type="search">

    <button>Search</button>
  </form>

  <ul>
    <li>
      <h5>Title #1...</h5>
      <p>Description here...</p>
    </li>
    <li>
      <h5>Title #2...</h5>
      <p>Description here...</p>
    </li>
  </ul>
</section>
```

In application tests we use page objects. Page object is usually composed from a different components and `visit` method.

Let's generate a Search Page page object:

```bash
$ ember generate page-object search

installing
  create tests/pages/search.js
```

```js
// project-name/tests/pages/search.js

import {
  create,
  collection,
  visitable
} from 'ember-cli-page-object';

import Form from './components/search-form';
import SearchItem from './components/search-item';

export default create({
  visit: visitable('/search'),

  scope: '.SearchPage',

  form: Form,

  results: collection('ul>li', SearchItem),

  // Let's also provide a shorhand for the search form submit
  async search(text) {
    await this.form.text.fillIn(text);

    await this.form.submit();
  }
})
```

In comparison to components which are plain JS definitions, page objects are ready to use instances, so we don't need to `create`.

```js
import searchPage from 'project-name/tests/pages/search';

test('it searches', async function(assert) {
  this.items = this.server.createList('item-model', [{
    title: 'Awesome Title'
  }, {
    title: 'Another Title'
  }])

  await searchPage.visit();
  await searchPage.search('some');

  assert.equal(searchPage.results.length, 1);
  assert.equal(searchPage.results[0].title, 'Awesome Title');
});
```

{% endraw %}
