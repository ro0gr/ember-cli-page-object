---
layout: page
title: Components
---

@todo: Outline

---

Components is a representation of some logical part a User Interface. It allows you to divide a complex pages or components into smaller composable components which makes it easier to manage different test scenarios.

Component definitions are just plain objects with attributes on it. To make definition ready to use component a page object instance should be created from the definition via `create` function:

```js
import { create } from 'ember-cli-page-object';

const myInput = create({
  scope: 'input'
});
```

## Attributes
By default, each component is supplied with some handy attributes, methods and actions without being explicitly declared:

```js
  test('heading', async function(assert) {
    await render(hbs`<input>`)

    assert.equal(myInput.isVisible, true);

    await myInput.fillIn('something');

    assert.equal(myInput.value, 'something');
  });
```

  Here is a full list of default component attributes:

* [as](./api/as)
* [blur](./api/blur)
* [click](./api/clickable)
* [clickOn](./api/click-on-text)
* [contains](./api/contains)
* [fillIn](./api/fillable)
* [focus](./api/focus)
* [isHidden](./api/is-hidden)
* [isPresent](./api/is-present)
* [isVisible](./api/is-visible)
* [select](./api/selectable)
* [text](./api/text)
* [value](./api/value)

Default attributes can be overriden or extended with an explicit attribute definitions. Let's say we have an input Ember component see how a plain `<input>` can be described with a component:

```html
<div data-test-input="firstName" class="has-error">
  <label for="firstName">First Name:</label>
  <input id="firstName" />
  <span class="error-message"></span>
</div>
```

```js

// package-name/tests/pages/components/input.js
import {
  hasClass,
  is,
  property,
  triggerable
} from 'ember-cli-page-object';

export default {
  scope: 'input',

  hasMouseOver: is(':hover'),

  hasError: hasClass('has-error'),

  isDisabled: property('disabled'),

  mouseEnter: triggerable('mouseenter')
};
```

And write a dummy tests just for demonstration purpose:

```js
import { create } from 'ember-cli-page-object'; 
import InputDefinition from 'package-name/tests/pages/components/input'; 

const input = create(InputDefinition);

test("it renders", async function(assert) {
  await render(hbs`<input>`);

  assert.equal(input.isDisabled, false);
  assert.equal(input.hasError, false);
});

test("Uses mouseEnter action", async function(assert) {
  await render(hbs`<input>`);

  await input.mouseEnter();

  assert.equal(input.hasMouseOver, true);
});
```

## Scopes Nesting

The `scope` attribute can be used to reduce the set of matched elements to the ones enclosed by the given selector.

Given the following HTML

```html
<div class="article">
  <p>Lorem ipsum dolor</p>
</div>
<div class="footer">
  <p>Copyright Acme Inc.</p>
</div>
```

the following configuration will match the article paragraph element

```js
const component = create({
  scope: '.article',

  textBody: text('p'),
});

assert.equal(component.textBody, 'Lorem ipsum dolor.');
```

The attribute's selector can be omited when the scope matches the element we want to use.

Given the following HTML

```html
<form class="AwesomeForm">
  <div data-test-firstName class="has-error">
    <label for="firstName">First Name:</label>
    <input id="firstName" />
    <span class="error-message"></span>
  </div>

  <div data-test-lastName class="has-error">
    <label for="lastName">Last Name:</label>
    <input id="lastName" />
    <span class="error-message"></span>
  </div>

  <button>Create</button>
</form>
```

We can define several attributes on the same `input` element as follows

```js
const page = create({
  input: {
    scope: '#userName',

    hasError: hasClass('has-error'),
    value: value(),
    fillIn: fillable()
  },

  submit: clickable('button')
});

await page
  .input
  .fillIn('an invalid value');

await page.submit();

assert.ok(page.input.hasError, 'Input has an error');
```

### A `component` inherits parent scope by default

```html
<form class="search">
  <input placeholder="Search...">
  <button>Search</button>
</form>
```

```js
const search = create({
  scope: '.search',

  fillIn: fillable('input'),
  value: value('input')
});
```

| call           | selector        |
|:---------------|:----------------|
| `search.value` | `.search input` |
{: .table}

You can reset parent scope by setting the `scope` and `resetScope` attribute on the component declaration.

```js
const page = create({
  search: {
    scope: '.search',

    input: {
      scope: 'input',
      resetScope: true,

      fillIn: fillable()
    }
  }
});
```

| call                      | translates to         |
|:--------------------------|:----------------------|
| `page.search.input.value` | `find('input').val()` |
{: .table}


Let's consider the following markup:


__Example Markup__

```html
<form class="AwesomeForm">
  <div data-test-firstName class="has-error">
    <label for="firstName">First Name:</label>
    <input id="firstName" />
    <span class="error-message"></span>
  </div>

  <div data-test-lastName class="has-error">
    <label for="lastName">Last Name:</label>
    <input id="lastName" />
    <span class="error-message"></span>
  </div>

  <button>Create</button>
</form>
```

```js
import { create } from 'ember-cli-page-object';

const form = create({
  scope: '.AwesomeForm',

  firstName: {
    scope: '[data-test-firstName]'
  },
  
  lastName: {
    scope: '[data-test-lastName]'
  },

  submit: {
    scope: 'button'
  }
});

await page
  .visit()
  .form
  .firstName('John')
  .lastName('Doe')
  .submit();
```
