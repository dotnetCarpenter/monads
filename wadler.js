function monad() { 
  "use strict";
  if(!this) // fix b0rken js spec
    return new monad(arguments);
  var fns = this.getArgs.call(arguments).map(this.identity);
  var continuation = this.bind(next, fns);
  continuation.destroy = this.bind(this.destroy, fns);
  return continuation;

  function next(){
    var args = monad.prototype.getArgs.call(arguments);
    var currentFn = this.shift();
    if(!currentFn) return;  // done
    currentFn.apply(null, [continuation].concat(args));
    //console.log("next is called");
  }
}
monad.prototype = {
  destroy: function destroy() {
    for(var i = 0, len = this.length; i < len; ++i)
      this[i] = null; // explitly null out references as some host objects doesn't deallocate otherwise (e.g. Titanium)
    this.length = 0;
    //console.log("destroy is called");
  },
  bind: function bind(fn, obj){
    if(fn.bind) return fn.bind(obj);
    else return function() {
      return fn.apply(obj, arguments);
    }
  },
  getArgs: function getArguments(from) {
    return Array.prototype.splice.call(this, (from || 0), this.length);
  },
  identity: function identity(fn) {
    return function(cb) {
      return cb(fn(monad.prototype.getArgs.call(arguments, 1)));
    }
  }
}


// wadler essence

function lam(x1, x2) {
  return x1 + x2;
}

var add = monad( lam );

console.log(add(10, 11));
add.destroy();
