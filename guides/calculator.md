---
layout: page
title: Quickstart
---

{% raw %}

With a help of EmberCLI Page Object you can describe any functional part of your UI by defining a desirable testing interfaces for your components, collections and their relationships.

Let's say we have a simple calculator component with an input field for entering numbers, "+" and "-" for setting an operation and the "=" button for triggering a calculation and displaying a result in the input field:

```html
<form class="QuickstartCalculator">
  <input class="Screen">

  <button class="Plus">+</button>
  <button class="Minus">-</button>
  <button class="Equals">=</button>
</form>
```

Let's define a page object component for that. 

In order to generate a component definition you can use a corresponding component generator:

```bash
$ ember generate page-object-component quickstart-calculator

installing
  create tests/pages/components/quickstart-calculator.js
```

Now edit a definition with the following structure:

```js
// your-app/tests/pages/components/quickstart-calculator.js

export default {
  scope: '.QuickstartCalculator',

  screen: { scope: 'input' },

  plus: { scope: '.Plus' },
  minus: { scope: '.Minus' },
  equals: { scope: '.Equals' }
}
```

Here we have a simple component definition for the calculator component. Definitions are used to [`create`](./api/create) a page object instances:

```js
// my-app/tests/components/quickstart-calculator-test.js

import { create } from 'ember-cli-page-object';
import QuickstartCalculator from 'my-app/tests/pages/components/quickstart-calculator';

const calculator = create(QuickstartCalculator);
```

Let's write our first test now:

```js
test('it works', async function(assert) {
  const { screen, plus, equals } = calculator;

  await render(hbs`{{quickstart-calculator}}`);

  await screen.fillIn(2);
  await plus.click();
  await screen.fillIn(2);
  await equals.click();

  assert.equal(screen.value, 4);
});
```

tbd
  - where the actions and props appeared from
  - Custom attr
  - adding a numpad

```js
// your-app/tests/pages/components/quickstart-calculator.js
import { hasClass } from 'ember-cli-page-object';

export default {
  scope: '.QuickstartCalculator',

  screen: {
    scope: 'input',

    hasError: hasClass('has-error')
  },

  // keep "plus", "minus" and "equals" unchanged
}

```

```js
// your-app/tests/pages/components/calculator.js

import { collection } from 'ember-cli-page-object';

export default {
  scope: '.QuickstartCalculator',

  screen: { scope: 'input' },

  plus: { scope: '.Plus' },
  minus: { scope: '.Minus' },
  equals: { scope: '.Equals' }

  numbers: collection('.Numpad > button'),

  clickNumber(number) {
    let pos = number === 0
      ? this.numbers.length - 1
      : number - 1;

    pos = this.numbers.length - 1;

    return this.numbers[pos].click();
  }
}

```

{% endraw %}
