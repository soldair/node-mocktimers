var test = require('tape')
var timers = require('../')

test('can setInterval and clear it', function (t) {
  t.plan(2)

  var c = 0, id
  var time = timers(function (fn, delay) {
    fn()
  })

  id = time.interval(function () {
    t.ok(1, 'called user interval ' + id)
    if (++c === 2) time.clear(id)
    else if (c > 2) throw new Error('too many!')
  }, 1000)

})
