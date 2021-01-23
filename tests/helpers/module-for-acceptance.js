import { module } from 'qunit';
import { resolve } from 'rsvp';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import { useNativeEvents } from 'ember-cli-page-object/extend';
import Ember from 'ember';
import require from 'require'

export default function(name, options = {}) {
  if (!require('ember-qunit').moduleForComponent) {
    return;
  }

  [false, true].forEach(_useNativeEvents => {
    let moduleName = name;
    if (_useNativeEvents) {
      moduleName += ' [native-events]';
    } else if (!Ember.hasOwnProperty('$')) {
      return;
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
        return resolve(afterEach).then(() => destroyApp(this.application));
      }
    });
  });
}
