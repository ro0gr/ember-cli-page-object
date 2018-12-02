---
layout: page
title: Components
---

Describe functional fragments of the DOM

* [Definitions](#definitions)
* [Scopes](#scopes)
* [Attributes](#attributes)
  * [Actions](#actions)
  * [Default attributes](#default-attributes)

## Definitions

Components are described with definitions which are just plain objects with attributes, methods and nested definitions on it

__Example Markup__

```html
<form class="awesome-form">
  <input id="firstName" placeholder="First name">
  <input id="lastName" placeholder="Last name">
  <button>Create</button>
</form>
```

__Definition Example__

```js
import {
  clickable,
  fillable
} from 'ember-cli-page-object';

const FormDefinition = {
  scope: '.awesome-form',

  firstName: fillable('#firstName'),
  lastName: fillable('#lastName'),
  submit: clickable('button')
};
```

Component instances are built by the `create` function:

__Usage__
```js
import { create } from 'ember-cli-page-object';

const form = create(FormDefinition);

await form
  .firstName('John')
  .lastName('Doe')
  .submit();
```

You can also define custom methods to aggregate complex interactions:

__Custom Method Example__

```js
import {
  fillable,
  clickable
} from 'ember-cli-page-object';

const FormDefinition = {
  scope: '.awesome-form',

  firstName: fillable('#firstName'),
  lastName: fillable('#lastName'),
  submit: clickable('button'),

  save(firstName, lastName) {
    return this
      .firstName(firstName)
      .lastName(lastName)
      .submit();
  }
};
```

__Usage__
```js
await form.save('John', 'Doe');
```

Definitions can also be used as a part of higher order definitions. This way you can describe complex interfaces by composition of simpler component definitions:

```js
import { visitable } from 'ember-cli-page-object';

const PageDefinition = {
  visit: visitable('/users/new'),

  form: FormDefinition
}
```

__Custom Method Usage__
```js
const myPage = create(PageDefinition);

await myPage
  .visit()
  .save('John', 'Doe');
```

## Scopes

CSS selector `scope` encloses a component to a corresponding DOM element. Parent scopes are encountered when calculating a nested component selector.

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
const page = create({
  scope: '.article',

  textBody: {
    scope: 'p'
  }
});

assert.equal(page.textBody.text, 'Lorem ipsum dolor.');
```

You can reset parent scope by setting the `resetScope` attribute on the component definition.

```js
const form = create({
  scope: '.my-form',

  dialog: {
    scope: '.some-dialog',

    resetScope: true
  }
});

await form.clickOn('Cancel');

assert.ok(form.dialog.isVisible);
```

## Attributes

Attributes are just Page Object aware wrappers around the low level DOM operations. It allows you to configure component's behavior in a declarative fashion.

By default attribute uses a parent component's `scope`:

```js
import { create, value } from 'ember-cli-page-object';

const input = create({
  scope: 'input[name="my-input"]',

  value: value()
})

assert.equal(input.value, 'some value');
```

In the assert statement above `value` attribute queries a DOM element with a selector equal to `input[name="my-input"]`.

You can also specify CSS selector by passing a `scope` as an attribute's argument:

```js
import { create, text } from 'ember-cli-page-object';

const customSelect = create({
  scope: '.my-select',

  value: text('.selected')
})

assert.equal(customSelect.value, 'some value');
```

In the assert statement above `text` attribute queries a DOM element with a selector equal to `.my-select .trigger`.

### Actions

Actions are a special kind of attributes which allows to perform async operations on the DOM.

```js
import { create, fillable, triggerable } from 'ember-cli-page-object';

const form = create({
  scope: 'form.search-form',

  fillIn: fillable('input[type="search"]'),

  submit: triggerable('submit')
})
```

A result of an action is a `Promise`-like chainable page object node. It allows to write your scenarios:

```js
await form
  .fillIn('some text')
  .submit();
```

### Default attributes

By default, all components define some handy attributes and methods without being explicitly declared.

* [as](/docs/v1.14.x/api/as)
* [blur](/docs/v1.14.x/api/blur)
* [click](/docs/v1.14.x/api/clickable)
* [clickOn](/docs/v1.14.x/api/click-on-text)
* [contains](/docs/v1.14.x/api/contains)
* [fillIn](/docs/v1.14.x/api/fillable)
* [focus](/docs/v1.14.x/api/focus)
* [isHidden](/docs/v1.14.x/api/is-hidden)
* [isPresent](/docs/v1.14.x/api/is-present)
* [isVisible](/docs/v1.14.x/api/is-visible)
* [select](/docs/v1.14.x/api/selectable)
* [text](/docs/v1.14.x/api/text)
* [value](/docs/v1.14.x/api/value)

<div class="alert alert-warning" role="alert">
  <strong>Note</strong> that these attributes will use the component scope as their selector.
</div>

__Example__

Suppose you have a modal dialog

```html
<div class="modal">
  Are you sure you want to exit the page?
  <button>I'm sure</button>
  <button>No</button>
</form>
```

```js
import { create, visitable } from 'ember-cli-page-object';

const page = create({
  visit: visitable('/'),

  modal: {
    scope: '.modal'
  }
});

await page.visit();

assert.ok(page.modal.contains('Are you sure you want to exit the page?'));

await page.modal.clickOn("I'm sure");
```
