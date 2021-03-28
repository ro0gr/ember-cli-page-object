import Application from 'dummy/app';
import config from 'dummy/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import { setAdapter, RFC268Adapter } from 'ember-cli-page-object';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

QUnit.testStart(() => {
  setAdapter(new RFC268Adapter());
});

start();
