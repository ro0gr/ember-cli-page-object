---
layout: page
title: Quickstart
---

{% raw %}

EmberCLI Page Object allows you to build powerful testing APIs for your UIs.

- [Basics](#basics)
- [Calculator](#calculator)
- [Application Pages](#application-pages)

## Basics

Page objects are being instantiated from definitions, which are plain javascript objects,
with a help of [`create`](./api/create) function.

The simplest possible definition has a CSS [`scope`](./query-options#scope) defined
to enclose page object to some DOM element.

You can also have nested definitions which would encounter parent scope [`by default`](./query-options#resetScope):

```js
import { create } from 'ember-cli-page-object';

const myForm = create({
  scope: 'form.my-form',

  datum: {
    scope: 'input[name="datum"]'
  }
})
```

Out of the box each component is supplied with a set of [default attributes](./components#default-attributes),
so we already can use our minimal page object as follows: 

```js
  test('dummy form', async function(assert) {
    await render(hbs`{{my-form}}`);

    assert.ok(myForm.isVisible);

    await myForm.datum.fillIn('text');

    assert.equal(myForm.datum.value, 'text');
  });
```

## Calculator

Let's say we have a simple calculator component.

In order to describe page object components you can use corresponding generator:

```bash
$ ember generate page-object-component quickstart-calculator

installing
  create tests/pages/components/quickstart-calculator.js
```

We should be able to click numpad buttons and `plus` button, submit the form to calculate a result.
We also need to read a calculation result from the calculator screen.

Let's update generated definition to satisfy these requirements:

```js
// your-app/tests/pages/components/quickstart-calculator.js
import {
  collection,
  clickable,
  triggerable,
  value
} from 'ember-cli-page-object';

export default {
  scope: 'form.quickstart-calculator',

  plus: clickable('button.plus'),

  equals: triggerable('submit'),

  value: value('input[name="screen"]'),

  digits: collection('.numpad > button'),
};
```

In addition to [`clickable`](./api/clickable), [`triggerable`](./api/triggerable) action attributes and [`value`](./api/value) getter attributes we've also used
a special [`collection`](./api/collection) attribute to describe a list of numpad buttons.

Now it's time to write first test with our page object:

```js
// my-app/tests/components/quickstart-calculator-test.js

import { create } from 'ember-cli-page-object';
import QuickstartCalculator from 'my-app/tests/pages/components/quickstart-calculator';

const calculator = create(QuickstartCalculator);

// ...

  test('it works', async function(assert) {
    await render(hbs`{{quickstart-calculator}}`);

    await calculator.digits[1].click();
    await calculator.plus();
    await calculator.digits[2].click();
    await calculator.equals();

    assert.equal(calculator.value, 5);
  });
```

As you can see we don't rely on any CSS selectors directly in our tests. It makes test suite easy to maintain because there is only a single place where all the selectors are kept.

However there is still some complexity in the test which is not obvious on the first glance.

A typical calculator numpad would look something like the following:

  [1] [2] [3]
  [4] [5] [6]
  [7] [8] [9]
      [0]

That's why we press "2" with:

```js
  await calculator.digits[1].click();
```

in case we need to press "0" digit, an invocation would look like:

```js
  await calculator.digits[9].click();
```

It can be challenging to keep in mind rules like this across your tests.

We can absorb such complexities by declaring custom methods:

```js
// your-app/tests/pages/components/quickstart-calculator.js

export default {
  // ...

  digits: collection('.numpad > button'),

  clickDigit(digit) {
    // convert digit to a button index
    const buttonIndex = (9 + digit) % 10;

    await this.digits[buttonIndex].click();

    return this;
  }
```

Note: by returning a page object instance from the `clickDigit` method we allow
chaining of page object actions, which also improves tests readability:

```js
// my-app/tests/components/quickstart-calculator-test.js
  test('it works', async function(assert) {
    await render(hbs`{{quickstart-calculator}}`);

    await calculator
      .clickDigit(2);
      .plus()
      .clickDigit(3)
      .equals();

    assert.equal(calculator.value, 5);
  });
```

Now we have a pretty solid and easy to use calculator testing API.

We've effectivelly hidden selectors and DOM layout complexity in our page object definition
which can be re-used across tests and other definitions.

## Application Pages

In application tests we usually deal with pages composed of several components connected to each other.

In order to simplify testing of such pages EmberCLI Page Object provides you with page-object 

Page object is a top-level component instance which allows to describe the whole page for your tests.

Let's say we have a simple page object definition for the search form:

```js
// your-app/tests/pages/components/search-form.js

import { triggerable } from 'ember-cli-page-object';

export default {
  scope: 'form.SearchForm',

  text: { scope: 'input[type="search"]' },

  submit: triggerable('submit')
};
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
 
  - Page Object is a [visitable](./api/visitable).
  - It's a ready to use instance, we don't need to use `create` an instance in tests.

Now, let's update page object with a proper route to visit and nested components for the form and results collection:

```js
import {
  create,
  collection,
  visitable
} from 'ember-cli-page-object';

import Form from './components/search-form';

export default create({
  scope: '.SearchPage',

  visit: visitable('/search'),

  results: collection('ul>li'),

  form: Form,

  async search(text) {
    await this.form.fillIn(text);

    return await this.form.submit();
  }
})
```

TBD

```js
import searchPage from 'project-name/tests/pages/search';
// ...

  test('it searches', async function(assert) {
    await searchPage.visit()
    await searchPage.search('some');

    const results = searchPage.results.map(i => i.text);
    assert.deepEqual(results, ['Some Text', 'Awesome Text']);
  });
```

{% endraw %}
