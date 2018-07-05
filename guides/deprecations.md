---
layout: page
title: deprecations
---
{% raw %}

## Deprecations

- [Comma separated selectors](#comma-separated-selectors)
- [App test-support](app-test-support)
- [Page Render](page-render)
  
### Comma separated selectors

**id**: ember-cli-page-object.comma-separated-selectors

Comma separated selectors are not supported in ember-cli-page-object anymore:

**Bad**

```js
var page = create({
  title: text("h1, h2") 
});
```

**Good**

```js
var page = create({
  title: text("[data-test-title]")
})
```

{% endraw %}

### App test-support

**id**: ember-cli-page-object.import-from-test-support

Importing page object helpers from `tests/` folder is deprecated. This behavior is going to be removed in ember-cli-page-object v2.0.

**Bad**
```js
import PageObject from "my-app/tests/page-object";

var page = PageObject.create({
  title: PageObject.text("h1") 
});
```

**Good**
```js
import { create, text } from "ember-cli-page-object";

var page = create({
  title: text("h1") 
});
```

### Page Render

**id**: ember-cli-page-object.page-render

Using `page.render('{{foo}}')` to render a component is deprecated.

```js
import { moduleForComponent, test } from 'ember-qunit';

import hbs from 'htmlbars-inline-precompile';
import { create } from 'ember-cli-page-object';

moduleForComponent('calculating-device', 'Deprecation | page.render()', {
  integration: true,

  beforeEach() {
    this.page = create({context: this});
  }
});

test('renders component', function(assert) {
  // BAD
  this.page.render(hbs`{{foo}}`);
  
  // GOOD
  this.render(hbs`{{foo}}`);
});
```

{% endraw %}
