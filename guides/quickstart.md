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

We can absorb such complexity by declaring a custom method for clicking
a desirable digit button:

```js
// your-app/tests/pages/components/quickstart-calculator.js

export default {
  // ...

  digits: collection('.numpad > button'),

  clickDigit(digit) {
    // convert digit to a button index in the collection
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

Testing of application pages is a bit different from testing components.

A typical page is composed of several components with their own interaction specifics.

Each page is also associated with some application route. It means, in order
to test a page we have to visit it by a certain URL.

The addon provides you with page objects optimized specifically for testing application pages.

In order to create a page object you can use corresponding generator:

```
$ ember generate page-object my-page

installing
  create tests/pages/my-page.js
```

As you can see page objects are generated under another location. 
This is done such way to easier distinguish component definitions, which are
located under `/tests/pages/components/`, between pages, which are located under
`/tests/pages/`.

A generated page object would look like the following:

```js
// my-app/tests/pages/my-page.js
import {
  create,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/')
});
```

TBD
- create vs definition
- visitable

{% endraw %}
