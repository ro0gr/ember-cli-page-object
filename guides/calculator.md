---
layout: page
title: Quickstart
---

{% raw %}

In EmberCLI Page Object components and collections are the primary building blocks to describe UI of your app. 

Let's say we have a simple calculator component with the following markup:

```html
<form class="QuickstartCalculator">
  <input name="screen">

  <button class="Plus">+</button>
  <button class="Minus">-</button>
  <button class="Equals">=</button>
</form>
```

In order to generate a component definition you can use a corresponding component generator:

```bash
$ ember generate page-object-component quickstart-calculator

installing
  create tests/pages/components/quickstart-calculator.js
```

In the markup we have a few operation buttons and an input field called `screen` where user can type input numbers
and see a calculation result after the `equals` button is pressed.

Let's describe it with a page object component definition:

```js
// your-app/tests/pages/components/quickstart-calculator.js
import {
  clickable,
} from 'ember-cli-page-object';

export default {
  scope: '.QuickstartCalculator',

  plus: clickable('.Plus'),
  minus: clickable('.Minus'),
  equals: clickable('.Equals'),

  screen: {
    scope: 'input[name="screen"]',
  }
};

```

Here we have a simple component definition for the calculator component. Definitions are used to [`create`](./api/create) a page object instances:

```js
// my-app/tests/components/quickstart-calculator-test.js

import { create } from 'ember-cli-page-object';
import QuickstartCalculator from 'my-app/tests/pages/components/quickstart-calculator';

const calc = create(QuickstartCalculator);
```

Let's write our first test now:

```js
  const { screen } = calc;

  test('it works', async function(assert) {
    await render(hbs`{{quickstart-calculator}}`);

    await screen.fillIn('3')
    await calc.plus();
    await screen.fillIn('2');
    await calc.equals();

    assert.equal(screen.value, 5);
  });
```

```html
<form class="QuickstartCalculator">
  <input name="screen">

  <fieldset>
    <legend>Numpad

    {{#each (array 0 1 2 3 4 5 6 7 8 9) |num|}}
      <button value={{num}}>{{num}}</button>
    {{/each}}
  </fieldset>

  <button class="Plus">+</button>
  <button class="Minus">-</button>
  <button class="Equals">=</button>
</form>
```

We could add 10 new components to the definition definition for each number button by using a `:nth-of-type` pseudo-selector, but there is a better way to do it using page object collections: 

```js
// your-app/tests/pages/components/calculator.js

import { collection } from 'ember-cli-page-object';

export default {
  scope: '.QuickstartCalculator',

  // ...

  nums: collection('.Numpad > button'),
}
```

Now we can access numpad buttons by their position in the markup:

```js
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

```js
// your-app/tests/pages/components/calculator.js

import {
  collection,
  clickable,
} from 'ember-cli-page-object';

export default {
  scope: '.QuickstartCalculator',

  plus: clickable('.Plus'),
  minus: clickable('.Minus'),
  equals: clickable('.Equals'),

  screen: {
    scope: 'input[name="screen"]'
  },

  nums: collection('.Numpad > button'),

  async fillIn() {
    await this.screen.fillIn(...arguments);

    return this;
  },

  async num(number) {
    const num = this.nums.toArray().find(n => n.value === number);

    await num.click();

    return this;
  }
}
```

```js
  test('numpad works', async function(assert) {
    await render(hbs`{{quickstart-calculator}}`);

    await cals.num(2)
      .plus()
      .num(2)
      .equals();

    assert.equal(calc.value, 24);
  });
```

{% endraw %}
