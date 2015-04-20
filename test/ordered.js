var test = require('tape')
var timers = require('../')
test('get called in correct order', function (t) {
  t.plan(3)
  var s = ''
  var time = timers()

  time.timeout(function () {
    s += 'c'
    t.equals(s, 'abc', 'timeouts should have been fired in correct order!')
  }, 1000)

  time.timeout(function () {
    s += 'a'
    t.equals(s, 'a')
    time.timeout(function () {
      s += 'b'
      t.equals(s, 'ab')
    }, 10)
  }, 10)

})
