import { moduleForProperty } from '../../../helpers/properties';
import { create, focusable } from 'ember-cli-page-object';

moduleForProperty('focusable', function(test, adapter) {
  test('calls focus with proper args', async function(assert) {
    assert.expect(1);

    let expectedSelector = 'input';
    let page = create({
      foo: focusable(expectedSelector)
    });

    await this.adapter.createTemplate(this, page, '<input />');

    this.adapter.$(expectedSelector).on('focus', () => {
      assert.ok(1);
    });
    await this.adapter.await(page.foo());
  });

  test('actually focuses the element', async function(assert) {
    assert.expect(2);

    let expectedSelector = 'input';
    let page = create({
      foo: focusable(expectedSelector)
    });

    await this.adapter.createTemplate(this, page, '<input />');

    let $element = this.adapter.$(expectedSelector);

    $element.on('focus', () => {
      assert.ok(1, 'focussed');
      assert.equal(document.activeElement, $element[0]);
    });
    await this.adapter.await(page.foo());
  });

  test('looks for elements inside the scope', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: focusable('input', { scope: '.scope' })
    });

    await this.adapter.createTemplate(this, page, '<div class="scope"><input/></div>');

    this.adapter.$('.scope input').on('focus', () => assert.ok(1));
    await this.adapter.await(page.foo());
  });

  test("looks for elements inside page's scope", async function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',

      foo: focusable('input')
    });

    await this.adapter.createTemplate(this, page, '<div class="scope"><input /></div>');

    this.adapter.$('.scope input').on('focus', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test('resets scope', async function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',
      foo: focusable('input', { resetScope: true })
    });

    await this.adapter.createTemplate(this, page, '<input/>');

    this.adapter.$('input').on('focus', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test('returns chainable object', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: focusable('input')
    });

    await this.adapter.createTemplate(this, page, '<input/>');

    this.adapter.$('input');

    assert.ok(page.foo);
  });

  test('finds element by index', async function(assert) {
    assert.expect(1);

    let expectedSelector = 'input:eq(3)';
    let page = create({
      foo: focusable('input', { at: 3 })
    });

    await this.adapter.createTemplate(this, page, '<input /><input /><input /><input />');

    this.adapter.$(expectedSelector).on('focus', () => assert.ok(1));
    await this.adapter.await(page.foo());
  });

  test('looks for elements outside the testing container', async function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page = create({
      foo: focusable('input', { testContainer: expectedContext })
    });

    await this.adapter.createTemplate(this, page, '<input />', { useAlternateContainer: true });

    this.adapter.$('input', expectedContext).on('focus', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test('looks for elements within test container specified at node level', async function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let page = create({
      testContainer: expectedContext,
      foo: focusable('input')
    });

    await this.adapter.createTemplate(this, page, '<input />', { useAlternateContainer: true });

    this.adapter.$('input', expectedContext).on('focus', () => assert.ok(1));

    await this.adapter.await(page.foo());
  });

  test("raises an error when the element doesn't exist", async function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        bar: {
          baz: {
            qux: focusable('button')
          }
        }
      }
    });

    await this.adapter.createTemplate(this, page);

    await this.adapter.throws(assert, function() {
      return page.foo.bar.baz.qux();
    }, /page\.foo\.bar\.baz\.qux/, 'Element not found');
  });

  test('Does not raise error when focussing focusable elements', async function(assert) {
    assert.expect(0);

    let page = create({
      foo: {
        bar: {
          input: focusable('input'),
          select: focusable('select'),
          a: focusable('a'),
          area: focusable('area'),
          iframe: focusable('iframe'),
          button: focusable('button'),
          contentEditable: focusable('[contenteditable]'),
          tabindex: focusable('[tabindex]'),

        }
      }
    });

    await this.adapter.createTemplate(this, page, `
      <input/>
      <a href="foo"></a>
      <area href="foo"></a>
      <iframe></iframe>
      <select></select>
      <button></button>
      <div contenteditable></div>
      <div tabindex=-1></div>
    `);

    await this.adapter.await(page.foo.bar.input());
    await this.adapter.await(page.foo.bar.select());
    await this.adapter.await(page.foo.bar.a());
    if (adapter === 'acceptance' || adapter === 'integration') {
      await this.adapter.await(page.foo.bar.area());
      await this.adapter.await(page.foo.bar.iframe());
    }
    await this.adapter.await(page.foo.bar.button());
    await this.adapter.await(page.foo.bar.contentEditable());
    await this.adapter.await(page.foo.bar.tabindex());
  });

  test('raises an error when the element is not focusable', async function(assert) {
    if (adapter === 'acceptance' || adapter === 'integration') {
      assert.expect(4);
    } else {
      assert.expect(2);
    }

    let page = create({
      foo: {
        bar: {
          baz: focusable('span'),
          qux: focusable('input'),
          quux: focusable('button'),
          quuz: focusable('[contenteditable]')
        }
      }
    });

    await this.adapter.createTemplate(this, page, `
      <span></span>
      <input disabled=true/>
      <button style="display: none;"></button>
      <div contenteditable="false"></div>
    `);

    await this.adapter.throws(assert, function() {
      return page.foo.bar.baz();
    }, /page\.foo\.bar\.baz/, 'Element is not focusable because it is not a link');

    if (adapter === 'acceptance' || adapter === 'integration') {
      await this.adapter.throws(assert, function() {
        return page.foo.bar.qux();
      }, /page\.foo\.bar\.qux/, 'Element is not focusable because it is disabled');

      await this.adapter.throws(assert, function() {
        return page.foo.bar.quux();
      }, /page\.foo\.bar\.quux/, 'Element is not focusable because it is hidden');
    }

    await this.adapter.throws(assert, function() {
      return page.foo.bar.quuz();
    }, /page\.foo\.bar\.quuz/, 'Element is not focusable because it is contenteditable="false"');
  });
});
