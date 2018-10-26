---
layout: page
title: Quickstart
---

{% raw %}

In EmberCLI Page Object [`components`](./components) and [`collections`](./api/collection) are the primary building blocks used to describe UI of your app. 

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

Now we can update generated file with the following contents:

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

In order to use definition as a page object we have to [`create`](./api/create) a page object instance:

```js
// my-app/tests/components/quickstart-calculator-test.js

import { create } from 'ember-cli-page-object';
import QuickstartCalculator from 'my-app/tests/pages/components/quickstart-calculator';

const calc = create(QuickstartCalculator);
```

Now we can write our first test:

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

Now we have a nice testing API for a `quickstart-calculator` component which is re-usable across tests. With such API 

Great! Now, let's say we've just got a `numpad` for our calculator:

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

There are page object collections to deal with lists of components:

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

// ...

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
{% endraw %}
