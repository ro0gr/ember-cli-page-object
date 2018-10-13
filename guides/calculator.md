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

  <fieldset>
    <legend>Numpad

    {{#each (array 0 1 2 3 4 5 6 7 8 9) |num|}}
      <button value="{{num}}">{{num}}</button>
    {{/each}}
  </fieldset>

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

Let's specify a component `scope` and define operations on it:

```js
// your-app/tests/pages/components/quickstart-calculator.js
import {
  clickable,
  fillable,
  value
} from 'ember-cli-page-object';

export default {
  scope: '.QuickstartCalculator',

  plus: clickable('.Plus')
  minus: clickable('.Minus'),
  equals: clickable('.Equals'),

  value: value('input[name="screen"]'),
  fillIn: fillable('input[name="screen"]'),
}
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
test('it works', async function(assert) {
  await render(hbs`{{quickstart-calculator}}`);

  await calc.fillIn(2)
    .plus()
    .fillIn(2)
    .equals();

  assert.equal(calc.value, 4);
});
```

tbd
  - default attrs: where the actions and props appeared from
  - Custom attr
  - adding a numpad

```html
<form class="QuickstartCalculator">
  <input name="screen">

  <fieldset>
    <legend>Numpad

    {{#each (array 1 2 3 4 5 6 7 8 9 0) |num|}}
      <button value="{{num}}">{{num}}</button>
    {{/each}}
  </fieldset>

  <button class="Plus">+</button>
  <button class="Minus">-</button>
  <button class="Equals">=</button>
</form>
```


```js
// your-app/tests/pages/components/calculator.js

import { collection } from 'ember-cli-page-object';

export default {
  scope: '.QuickstartCalculator',

  nums: collection('.Numpad > button'),

  // ...
}
```

With a collection we can access a component by its index 

```js
  // click "1"
  await calc.nums[0].click();
  // click "0"
  await calc.nums[9].click();
});
```

```js
// your-app/tests/pages/components/calculator.js

import { collection } from 'ember-cli-page-object';

export default {
  scope: '.QuickstartCalculator',

  nums: collection('.Numpad > button'),

  num(number) {
    return this.nums.toArray().find(n => n.value === number);
  },

  async clickNum(number) {
    await this.num(number).click();

    return this;
  },

  // ...
}
```

```js
test('numpad works', async function(assert) {
  await render(hbs`{{quickstart-calculator}}`);

  await calc.clickNumber(2)
    .clickNumber(2)
    .plus()
    .clickNumber(2)
    .equals();

  assert.equal(calc.value, 24);
});
```


{% endraw %}
