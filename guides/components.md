---
layout: page
title: Components
---

@todo: Outline

---

Components is a way to describe some functional part of the DOM with a convenient API. Component definitions are just plain objects with attributes on it. Component definition requires a CSS `scope` to be declared in order to be mapped to an appropriate DOM Element:

```js
import { create } from 'ember-cli-page-object';

const myInput = create({
  scope: 'input'
});
```

Nested components inherit a parent scope when its attribute queried:

```js
const myForm = create({
  scope: '.MyForm',

  magicButton: {
    scope: '.MagicButton'
  }
});

// `magicButton` has a concatenated CSS selector: ".MyForm .MagicButton"
assert.equal(myForm.magicButton.isVisible, true);
```

## Attributes

Each component is supplied with some handy attributes, methods and actions without being explicitly declared:

```js
  await render(hbs`<input>`);

  await myInput.fillIn('some text');

  assert.equal(myInput.text, 'some text');
```

Component supports the following default attributes:

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

You can also extend a component behavior with custom attributes:

```js
import {
  create,
  attribute,
  hasClass,
  property,
  triggeratble
} from 'ember-cli-page-object';

const myInput = create({
  scope: 'input',

  isDisabled: attribute('placeholder'),

  isDisabled: property('disabled'),

  hasFocus: hasClass('has-focus'),

  mouseEnter: triggerable('mouseenter')
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
    <label for="password">Last Name:</label>
    <input id="password" />
    <span class="error-message"></span>
  </div>

  <button>Login</button>
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
