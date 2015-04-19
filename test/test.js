var test = require('tape');

test("can load index",function(t){
  t.ok(typeof require('../') == 'function');
  t.end();
})
