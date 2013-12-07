// Interpretation in a monad (call-by-value)

function M(value) {
  this.value = value;
}
M.prototype.bind = function bind(id, fun) { // >>=
  return fun.call(id, id.value)
}
M.prototype.unit = function unit(value) { // return
  return new this.constructor(value)
}

var monad = new M();

// helper functions
function log(el) {
  return function(msg) {
    el.innerHTML += msg;
  }
}

function Composer(fun) {
  //this.value = this.constructor.unit(el instanceof String ? document.getElementById(el) : el);
  var super = this;
  this.bind = super.bind()
}
Logger.prototype = new M();

var logger = new Logger(log);

/*
monad.bind(monad.unit("hej "), function(a) {
  return monad.bind(monad.unit("med dig"), function(b) {
    return logger(a+b)
  })
})*/

