---
layout: page
title: Query-Options
---

You can adjust component and attributes query selector with the following options:

* [scope](#scope)
* [resetScope](#resetScope)
* [testContainer](#testContainer)
* [multiple](#multiple)
* [at](#at)

## scope

The `scope` option can be used to do nesting of the provided selector
within the inherited scope.

Given the following HTML

```html
<article>
  <p>Lorem ipsum dolor</p>
</article>

<footer>
  <p>Copyright 2016 - Acme Inc.</p>
</footer>
```

the following configuration will match the footer element

```js
const page = create({
  article: {
    scope: 'article'
  },

  copyrightNotice: {
    scope: 'footer'
  }
});

assert.equal(page.copyrightNotice.text, 'Copyright 2015 - Acme Inc.');
```

## resetScope

A parent scope can be reseted by setting a `resetScope` attribute:

```js
import { create } from 'ember-cli-page-object';

const form = create({
  scope: '.MyForm',

  dialog: {
    scope: '.SomeDialog',

    resetScope: true
  }
});

await form.clickOn('Cancel');

assert.ok(form.dialog.isVisible);
```

## testContainer

In case you have a component which renders outside of regular test container you can adjust a root node to find from with `testContainer` option:

```js
import { create } from 'ember-cli-page-object';

const t = create({
  scope: '.tooltip'
  testContainer: 'body'
});

assert.equal(t.text, 'Lorem tooltip'); 
```

## multiple

By default, element lookup will throw an error if more than on element
is matched. Setting the `multiple` option will override this behavior:

```html
<span>Lorem</span>
<span>ipsum</span>
```

```js
import { create, text } from 'ember-cli-page-object';

const page = create({
  words: text('span', { multiple: true })
});

andThen(function() {
  assert.deepEqual(page.word, ['Lorem', 'ipsum']); // => ok
});
```

The return value of each property using the `multiple` option can be
found in the API documentation.

## at

The `at` option can be used to reduce the set of matched elements to the one at the specified index (starting from zero).

```html
<span>Lorem</span>
<span>ipsum</span>
<span>dolor</span>
```

the following configuration will match the second `span` element

```js
import { create, text } from 'ember-cli-page-object';

const page = create({
  word: text('span', { at: 1 })
});

andThen(function() {
  assert.equal(page.word, 'ipsum'); // => ok
});
```
