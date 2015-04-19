var test = require('tape')
var timers = require('../')
test('can use unmock object', function (t) {
  var time = timers(function (fn) {
    fn()
  })

  t.ok(time.now(), 'should have time')

  time.timeout(function () {
    t.ok(1, 'caled timeout')
    var id = time.interval(function () {
      time.clear(id)
      t.ok(1, 'called interval')
      t.end()
    }, 0)
  }, 0)
})
