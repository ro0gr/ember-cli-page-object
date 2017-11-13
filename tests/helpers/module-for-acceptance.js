import { module } from 'qunit';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import { useNativeEvents } from 'ember-cli-page-object/extend';

const { RSVP: { Promise } } = Ember;

export default function(name, options = {}) {
  [false, true].forEach(_useNativeEvents => {
    let moduleName = name;
    if (_useNativeEvents) {
      moduleName += ' [native-events]';
    }

    module(moduleName, {
      beforeEach() {
        this.application = startApp();

        useNativeEvents(_useNativeEvents);

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },

      afterEach() {
        useNativeEvents(false);

        let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(() => destroyApp(this.application));
      }
    });
  });
}
