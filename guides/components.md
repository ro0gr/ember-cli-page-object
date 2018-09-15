---
layout: page
title: Components
---

Describe some functional part of a DOM.

* [Scopes](#scopes)
* [Attributes](#attributes)
* [Default attributes](#default-attributes)

## Scopes

CSS selector `scope` attribute is used to find a corresponding DOM Element.

```js
import { create } from 'ember-cli-page-object';

const a = create({
  scope: 'article',

  title: {
    scope: '[data-test-title]'
  },

  teaser: {
    scope: '[data-test-teaser]',
  },

  showMore: {
    scope: 'a.show-more'
  }
});
```

Parent scope is encountered when building a final selector:

```js
assert.ok(a.title.text); // => '#ember-testing article [data-test-title]'
```

would search for text property of the element with "article [data-test-title]" CSS path.

For more details for configuring a query selector please take a look at [Query Options](./query-options) page.

## Attributes

We can also define attributes on a component as follows:

```js
import { hasClass, clickable } from 'ember-cli-page-object';

const page = create({
  scope: 'form',

  datum: {
    scope: 'input[name="datum"]',

    hasError: hasClass('has-error'),
  },

  submit: clickable('button')
});

await page.datum.fillIn('an invalid value');

await page.submit();

assert.ok(page.datum.hasError, 'Input has an error');
```

## Default Attributes

All components are supplied with default attributes without being explicitly declared. 

Here is a list of all the component default attributes:

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
