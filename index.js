module.exports = function (delay) {
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
      setImmediate(function () {
        delay(function () {
          t = Date.now() - t
          if (t < dur) self.msoffset += dur - t
          if (self.timers[id]) fn()
        }, dur)
      })
      return id
    },
    interval: function (fn, dur) {
      var self = this
      var id = ++self.i
      var timer
      (function n () {
        timer = self.timeout(function () {
          fn()
          n()
        }, dur)
        self.intervals[id] = timer
      })()
      return id
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
