---
layout: page
title: Quickstart
---

{% raw %}

In EmberCLI Page Object [`components`](./components) and [`collections`](./api/collection) are the primary building blocks to describe UI of your app. 

Let's say we have a simple calculator component with the following markup:

```html
<form class="quickstart-calculator">
  <input name="screen">

  <button class="equals">=</button>

  <button class="plus">+</button>
  <button class="minus">-</button>
</form>
```

Here we have an input called `screen` which is responsible for reading numbers entered by user and displaying a calculation result when the `equals` button is pressed. There are also `plus` and `minus` operator buttons defined.

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

In EmberCLI Page Object any plain javascript object is treated as a component declaration.
Each component can have its own CSS selector [`scope`](./query-options#scope), which allows to build a valid query selector while looking for the component in DOM. A parent `scope` is also taken into account when component selector is being built. 

We can customize a page object API with custom attributes. In our example we have extended a calculator API with `plus`, `minus` and `equal` [`clickable`](./api/clickable) actions.

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

// ...

  const { screen } = calc; // we can use a shorthand for nested components

  test('it works', async function(assert) {
    await render(hbs`{{quickstart-calculator}}`);

    await screen.fillIn('1'); // `fillIn` is a default component action
    await calc.plus();
    await screen.fillIn('2');
    await calc.equals();

    assert.equal(screen.value, '3'); // `value` is a default component property
  });
```

Please note, in the test we've used `screen.fillIn()` action and `screen.value` property which are a part of [default attributes](./components#default-attributes) available for each component. 

Well, we have just handled a single component case, but sometimes we have to deal with components represented as a list on the page.

Let's say we've just got a `numpad` for our calculator:

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

```js
// your-app/tests/pages/components/quickstart-calculator.js

import {
  collection,
  clickable,
} from 'ember-cli-page-object';

export default {
  scope: '.quickstart-calculator',

  screen: {
    scope: 'input[name="screen"]'
  },

  equals: clickable('.equals'),

  plus: clickable('.plus'),
  minus: clickable('.minus'),

  nums: collection('.Numpad > button'),

  async fillIn() {
    await this.screen.fillIn(...arguments);

    return this;
  },

  async num(number) {
    const numBtn = this.nums.toArray().find(n => n.value === number);

    await numBtn.click();

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
