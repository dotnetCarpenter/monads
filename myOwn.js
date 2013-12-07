var compose = function() { // continuation passing style - runs all supplied functions unless there is an rejection, then it stops.
  function next(){
    var args = getArgs.call(arguments);
    var currentFn = this.shift();
    if(!currentFn)
      return args[0];  // done
    return currentFn(continuation, args[0]);
  }
  var args = getArgs.call(arguments)
    .map(function(fn) {
      return new identity().bind2(fn)
    });
  var continuation = next.bind(args);
  return continuation;
}
function getArgs() {
  return Array.prototype.splice.call(this, 0, this.length);
}

function identity(value) {
  this.value = value;
}
identity.prototype.bind2 = function bind(fn) { // >>=
  var self = this;
  return function(cb, data) {
    var ret = cb( self.unit( fn(data instanceof identity ? data.value : data)) );
    return ret;
  }
}
identity.prototype.unit = function unit(value) { // return
  return new this.constructor(value)
}

var test1 = compose(add1, add2, pow);
// var test2 = compose(add1, add2, multi, long);
console.dir(test1(3.48074069840786))

// proof
var monad = new identity();
console.log(
/* Left identity */   compose(add2)(40).value === add2(40)
/* Right identity */, compose(add1, add2)(39).value === add2(add1(39))
/* Associativity */ , compose(add1, function(x) {
                                      return compose(add2)(x).value
                                    })(39).value
                      ===
                      compose(compose(add1), function(x) {
                        return add2(x.value);
                      })(39).value
);

/*** functions to test ***/
function add1(a) {
  return a + 1
}
function add2(a) {
  return a + 2
}
function pow(a) {
  return a * a;
}
function long(a) {
  return setTimeout(add1, 500) 
}

