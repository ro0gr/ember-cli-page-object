---
layout: page
title: Quickstart
---

{% raw %}

In EmberCLI Page Object [`components`](./components) and [`collections`](./api/collection) are the primary building blocks used to describe UI of your app. 


 - [Component Definition](#component-definition)
 - [Collections](#collections)
 - [Page Objects](#page-objects)

## Component Definition

Let's say we have a simple calculator component with the following markup:

```html
<form class="quickstart-calculator">
  <input name="screen">

  <button class="equals">=</button>

  <button class="plus">+</button>
  <button class="minus">-</button>
</form>
```

In this example `screen` input allows user to enter numbers to be calculated and to see a calculation result after the `equals` button is pressed.

Let’s create a page object component definition for the `quickstart-calculator` component.

In order to generate a component definition you can use a corresponding component generator:

```bash
$ ember generate page-object-component quickstart-calculator

installing
  create tests/pages/components/quickstart-calculator.js
```

Now let's update generated file with the following contents:

```js
// your-app/tests/pages/components/quickstart-calculator.js
import { clickable } from 'ember-cli-page-object';

export default {
  scope: '.quickstart-calculator',

  screen: {
    scope: 'input[name="screen"]',
  },

  equals: clickable('.equals'),

  plus: clickable('.plus'),

  minus: clickable('.minus'),
};
```

We expressed `screen` input as a nested component with only a [`scope`](./query-options#scope) attribute defined.

Out of the box each component is suplied with a set of [default attributes](./components#default-attributes). We will use [`fillIn`](./api/fillable) and [`value`](./api/value) default attributes of the `screen` in our tests.

We also declared few explicit [`clickable`](./api/clickable) actions for operator buttons.

Now we can [`create`](./api/create) a page object instance from the definition to use it in tests:

```js
// my-app/tests/components/quickstart-calculator-test.js

import { create } from 'ember-cli-page-object';
import QuickstartCalculator from 'my-app/tests/pages/components/quickstart-calculator';

const calc = create(QuickstartCalculator);
```

Let's write a test now!

```js
// my-app/tests/components/quickstart-calculator-test.js
  const { screen } = calc;

  test('it works', async function(assert) {
    await render(hbs`{{quickstart-calculator}}`);

    await screen.fillIn('1');
    await calc.plus();
    await screen.fillIn('2');
    await calc.equals();

    assert.equal(screen.value, '3');
  });
```

As you can see we don't rely on any CSS selectors directly in our tests. It makes testsuites more maintainable because there is a single source of truth for application test selectors and DOM interactions complexity.

## Collections

While component definition is supposed to be used for a single component on a page, it's typical to have a series of components rendered in a loop.

Let's say we've implemented a `numpad` block for our calculator:

```html
<form class="quickstart-calculator">
  <input name="screen">

  <button class="equals">=</button>

  <button class="plus">+</button>
  <button class="minus">-</button>

  <fieldset class="numpad">
    <legend>Numpad

    {{#each (array 0 1 2 3 4 5 6 7 8 9) |num|}}
      <button>{{num}}</button>
    {{/each}}
  </fieldset>
</form>
```

Now we have the same `button` component on the page repeated 10 times. We could declare 10 new components for each digit `button` in our `quickstart-caclulator` definition, but there is a more efficient way to do it called [`collection`](./api/collection).

```js
// your-app/tests/pages/components/calculator.js

import { collection } from 'ember-cli-page-object';

export default {
  scope: '.quickstart-calculator',

  // ...

  nums: collection('.numpad > button'),
}
```

Now we can access numpad buttons by their position in the markup:

```js
// my-app/tests/components/quickstart-calculator-test.js
  const { screen, numpad } = calc;

  test('numpad also works', async function(assert) {
    await render(hbs`{{quickstart-calculator}}`);

    await numpad[3].click();
    await calc.plus();
    await numpad[2].click();
    await calc.equals();

    assert.equal(screen.value, 5);
  });
```

## Page Objects

Page object is a top-level component instance which allows to describe the whole page for your tests.

Let's say we have object component definitions for the search form:

```js
// your-app/tests/pages/components/search-form.js

import { triggerable } from 'ember-cli-page-object';

export default {
  scope: 'form',

  text: { scope: 'input[type="search"]' },

  submit: triggerable('submit')
};
```

and for the search results list item:

```js
// your-app/tests/pages/components/search-item.js
export default {
  scope: 'li',

  title: { scope: 'h5' },

  description: { scope: 'p' }
}
```

In order to test search page we can create a `search` page object. Let's do it by using `page-object` generator:

```
$ ember generate page-object search

installing
  create tests/pages/search.js
```

it would produce the following output: 

```js
// project-name/tests/pages/search.js
import {
  create,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/')
});
```

As you can see there are few noticable differences with component definitions:
 
  - Page object is [visitable](./api/visitable).
  - It's a ready to use instance, so we don't need to additionally `create` an instance in tests

Now, let's update page object with a proper route to visit and nested components for the form and results collection:

```js
import {
  create,
  collection,
  visitable
} from 'ember-cli-page-object';

import Form from './components/search-form';
import SearchItem from './components/search-item';

export default create({
  scope: '.SearchPage',

  visit: visitable('/search'),

  form: Form,

  results: collection('ul>li', SearchItem)
})
```

```js
import searchPage from 'project-name/tests/pages/search';
// ...

  test('it searches', async function(assert) {
    await searchPage.visit()
    await searchPage.form.text.fillIn('some');
    await searchPage.form.submit();

    assert.equal(searchPage.results.length, 1);
    assert.equal(searchPage.results[0].title, 'Awesome Title');
  });
```

{% endraw %}
