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

## Component Definition

Suppose we have a simple search form with the following HTML markup:

```html
<form class="SearchForm">
  <input type="search" placeholder="Search it!">

  <button>Search</button>
</form>
```

Use `page-object-component` blueprint to quickly generate a placeholder for component definition :

```bash
$ ember generate page-object-component search-form

installing
  create tests/pages/components/search-form.js
```

Let's describe a search form with a page object definition:

```js
// project-name/tests/pages/components/search-form.js

export default {
  scope: 'form.SearchForm',

  input: {
    scope: 'input[type="search"]'
  },

  submitButton: {
    scope: 'button'
  }
}
```

Now we can use our definition in tests:

```js
// First we need to create a page object instance from the definition
import { create } from 'ember-cli-page-object';
import SearchForm from 'project-name/tests/pages/components/search-form';

const form = create(SearchForm);

test('it renders empty', async function(assert) {
  await render(`{{search-form}}`);

  assert.ok(form.isVisible);
  assert.equal(form.input.value, '');
  assert.equal(form.submitButton.text, 'Search');
});

test('submit', async function(assert) {
  this.onSubmit = = sinon.spy();
  await render(`{{search-form
    onSubmit=(action this.onSubmit)
  }}`);

  await form.field.fillIn('search text');
  await form.searchButton.click();

  assert.ok(this.onSubmit.calledWith('search text'))
});
```

We just have used few component [default attributes](./api/components#default-attributes) like `isVisible`, `fillIn`, `value`, and others. For the comprehensive list of all attributes available please see API documentation.

# Simple list

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

## moduleFor test helpers

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
    // @todo: check if it's working
    this.store.createRecord('awesome-item', {
      title: 'Some title'
    })
  ];

  render(`{{awesome-list items=this.items}}`);

  assert.equal(awesomeList.items.length, 1);
  assert.equal(awesomeList.items[0].title.text, 'Some title');
}

```

{% endraw %}
