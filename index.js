module.exports = function (delay) {
  if (!delay) delay = defaultDelay
  delay = ordered(delay)

  var o = {
    i: 0,
    // track the time that i should have spent in timeouts to add to now.
    msoffset: 0,
    timers: {},
    intervals: {},
    timeout: function (fn, dur) {
      var self = this
      var id = ++self.i
      var t = Date.now()

      dur = dur || 1
      if (dur < 0) dur = 1

      self.timers[id] = true
      delay(function () {
        t = Date.now() - t
        if (t < dur) self.msoffset += (dur + 1) - t
        if (self.timers[id]) fn()
        delete self.timers[id]
      }, dur)
      return id
    },
    interval: function (fn, dur) {
      var self = this
      var id = ++self.i
      var timer
      (function n () {
        timer = self.timeout(function () {
          fn()
          if (self.intervals[id]) n()
        }, dur)
        self.intervals[id] = timer
      })()
      return id
    },
    clear: function (id) {
      var self = this
      if (self.intervals[id]) {
        delete self.timers[self.intervals[id]]
        delete self.intervals[id]
      }
      delete self.timers[id]
    },
    // lets you get a clock that maintains the contract of timeouts taking at least timeout ms
    now: function () {
      if (!this._now) this._now = Date.now()
      return Date.now() + this.msoffset
    },
    unmock: function () {
      return {
        interval: setInterval,
        timeout: setTimeout,
        now: Date.now,
        unmock: function () {
          return this
        }
      }
    }
  }

  return o
}

// one call gets run each turn on setImmediate until none are left.
function ordered (ondelay) {
  var clk = 0
  var queue = []

  var checking = 0
  function check () {
    if (checking++) return

    setImmediate(function () {
      var o = queue.shift()
      clk = o[1]
      ondelay(function () {
        checking = 0
        if (queue.length) check()
        o[0]()
      }, o[2])
    })
  }

  function delay (fn, ms) {
    var len = queue.length, i = 0
    while (queue.length === len) {
      if (queue[i]) {
        if (queue[i][1] > clk + ms) {
          queue.splice(i, 0, [fn, clk + ms, ms])
        }
      } else queue.push([fn, clk + ms, ms])
      ++i
    }
    check()
  }

  return delay
}

function defaultDelay (fn) {
  fn()
}
