import { test, module } from 'qunit';
import { setupTest } from 'ember-qunit';
import require from 'require';

import { run, isChainedNode } from 'ember-cli-page-object/test-support/-private/action'
import { create } from 'ember-cli-page-object'

const resolvable = () => new Promise((resolve) => setTimeout(resolve, 10));

const instance = create({
  doWithRun(assert, label) {
    assert.step(`invoke ${ label }`)

    return run(this, () => {
      assert.step(`begin ${ label }`)

      return resolvable().then(() => {
        assert.step(`complete ${ label }`)
      })
    })
  }
});

if (require.has('@ember/test-helpers')) {
  module('Unit | action', function(hooks) {
    setupTest(hooks);

    test('isChainedNode: not chained', async function(assert) {
      assert.equal(isChainedNode(instance), false)
    });

    test('isChainedNode: chained', async function(assert) {
      const node = run(instance, () => {});

      assert.equal(isChainedNode(node), true)
    });

    test('chained invocations', async function(assert) {
      await instance.doWithRun(assert, '#1')
        .doWithRun(assert, `#2`);

      assert.verifySteps([
        'invoke #1',
        'begin #1',
        'invoke #2',
        'complete #1',
        'begin #2',
        'complete #2'
      ])
    });

    test('not chained invocations', async function(assert) {
      instance.doWithRun(assert, '#1')

      await instance.doWithRun(assert, `#2`);

      assert.verifySteps([
        'invoke #1',
        'begin #1',
        'invoke #2',
        'begin #2',
        'complete #1',
        'complete #2'
      ])
    });
  });
}
