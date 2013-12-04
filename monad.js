/**
 * Generator style organization of a program workflow
 * @version 2003.9.1
 * @author jon.ronnenberg@gmail.com
 * Issues: a compose can not be recomposed. e.g. compose(function, compose(function))
 *         a composition can only run once - then it's empty
 */

var hBird = hBird || {};
// continuation passing style - each time the continuation is called the next funciton is called
// if destroy is called, all functions (continuations) are purged
hBird.compose = function() { 
  "use strict";
  var fns = getArguments.call(arguments);
  var continuation = bind(next, fns);
  continuation.destroy = bind(destroy, fns);
  return continuation;

  function destroy() {
    for(var i = 0, len = this.length; i < len; ++i)
      this[i] = null; // explitly null out references as some host objects doesn't deallocate otherwise (e.g. Titanium)
    this.length = 0;
    //console.log("destroy is called");
  }
  function next(){
    var args = getArguments.call(arguments);
    var currentFn = this.shift();
    if(!currentFn) return;  // done
    currentFn.call(null, continuation, args[0]);
    //console.log("next is called");
  }
  function bind(fn, obj){
    if(fn.bind) return fn.bind(obj);
    else return function() {
      return fn.apply(obj, arguments);
    }
  }
  function getArguments() {
    return Array.prototype.splice.call(this, 0, this.length);
  }
}

hBird.composeCycle = function() { 
  "use strict";
  var fns = getArguments.call(arguments);
  var counter = { c: 0, max: fns.length };
  var continuation = bind(next, fns);
  continuation.destroy = bind(destroy, fns);
  return continuation;

  function destroy() {
    for(var i = 0, len = this.length; i < len; ++i)
      this[i] = null; // explitly null out references as some host objects doesn't deallocate otherwise (e.g. Titanium)
    this.length = 0;
    //console.log("destroy is called");
  }
  function next(){
    var args = getArguments.call(arguments);
    var currentFn = this[counter.c++ % counter.max];
    currentFn.call(null, continuation, args[0]);
    //console.log("next is called");
  }
  function bind(fn, obj){
    if(fn.bind) return fn.bind(obj);
    else return function() {
      return fn.apply(obj, arguments);
    }
  }
  function getArguments() {
    return Array.prototype.splice.call(this, 0, this.length);
  }
}


function identity(fn) {
  return function(cb, data) {
    cb(fn(data));
  }
};

function continuation(fn) {
  return function(cb, data) {
    fn(cb, data));
  }
}

function wait(wait) {
  "use strict";
  return function(cb, config) {
    setTimeout(function() {
      cb(config);
    }, wait)
  }
};

function defer() {
  return hBird.wait(0);
}

function noOp(cb, config) { cb; };