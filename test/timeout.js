var test = require('tape')
var timers = require('../')

test('can setTimeout', function (t) {
  t.plan(4)

  var time = timers(function (fn, delay) {
    t.ok(true, 'called custom delay function')
    fn() // callback with no delay. still async a la setImmediate
  })

  t.equals(time.now(), Date.now())// true

  time.timeout(function () {
    t.ok(1, 'called user timeout')
    t.ok(time.now() - 1000 >= Date.now(), 'custom clock is correct.') // true
  }, 1000)

})
