import { create, Component } from "ember-cli-page-object";

const c = {};

const Def = {
  scope: '.AComponent',

  c,

  b: { c },

  str: 'asd',

  fly() {
    return "a";
  },

  async do() {
    await this.click();
  }
}

const a = create(Def);

const done = a.do();
done.then(async function(this: Component<typeof Def>) {
  await this.do();
});

a.isVisible;
a.click().focus();
a.b.click()
a.b.c.click();
a.click().b
// custom props
a.str.substr(0);

// !!!!!!!!!!!!!!!!
// SHOULD FAIL
// !!!!!!!!!!!!!!!!
a.click().isVisible
a.isVisible.b
a.isVisible.click();
a.fly().isVisible
a.fly.asdas
a.str.toExponential();

create({
  scope: 13
});
