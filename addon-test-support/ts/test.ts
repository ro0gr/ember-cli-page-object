const c = {};
const b = { c }
const C = d => d;

// should PASS
const a = PO.create(C({
  scope: 'asdasd',
  c,
  b,
  str: 'asd',
  fly() {
    return "a";
  }
}));

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

create({
  scope: 13
});
