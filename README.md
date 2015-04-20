
# mocktimers

mock timers and timeouts so you can test timer dependent modules without waiting and realistically. 

```js
var timers = require('mocktimers')

var time = timers();

console.log(time.now() == Date.now())// true

time.timeout(function(){
  console.log(time.now()-1000 >= Date.now()) // true
},1000);

```

timeouts are executed in order 


```js
var time = require('mocktimers')()

var s = "";

time.timeout(funciton(){
  s += 'c'
  console.log('i know my ',s); // prints "i know my abc"
},1000)

time.timeout(function(){
  s += 'a'
  time.timeout(function(){
    s += 'b'
  },10)
},10)

```

api
---

### time = require('mocktimers')(delay handler)

the default export is a function that returns an object with all of the timing methods. "time"

 - [OPTIONAL] delay handler function(fn,delay)
  - fn, the callback after the delay 
  - delay, and the ms to delay.

### time.timeout(fn,delay)

 setTimeout. returns id

### time.interval(fn.delay)

 setInterval. returns id

### time.clear(id)

 stop a timeout or interval by id

### time.now()

 corrected Date.now

### time.unmock()

  return an object with this interface that uses the real time functions  

mocking time...
---------------

so to use this in your tests you would have to use an object like this in your program instead of hitting setTimeout directly. and maybe hang it off of module.exports so you can patch it from the test with this object.

```js
var time = {interval:setInterval,timeout:setTimeout,now:Date.now,clear:clearTimeout};
```

time.unmock has been added to help with this.






[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
