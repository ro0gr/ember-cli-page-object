import {
  create,
  Component,
  ActionResult,
  clickable
} from "ember-cli-page-object";

const c = {
  do: clickable()
};

const Def = {
  scope: '.AComponent',

  c,

  b: { c },

  str: 'asd',

  fly() {
    return "a";
  },

  do() {
    return <ActionResult<typeof Def>>this.click();
  }
}

const a = create(Def);

a.do().c;
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
