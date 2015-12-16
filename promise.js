'use strict';

function Promise(executor) {
  let thenables = [];
  let rejects = [];
  let state = 'pending';
  let value;
  let timer;

  this.then = (f, r) => {
    if(timer)
      timer = clearTimeout(timer);
    thenables.push(f);
    rejects.push(r);

    if(state === 'fulfilled')
      timer = setTimeout(this.resolve.bind(this, value), 0);
    else
    if(state === 'rejected')
      timer = setTimeout(this.reject.bind(this, value), 0);

    return this;
  };
  this.resolve = v => {
    state = 'fulfilled';
    value = v;

    let chainableValue = value;
    thenables.forEach(f => chainableValue = f(chainableValue || value));
    thenables = [];
  //  console.log(this, state, value, thenables);
  };
  this.reject = v => {
    state = 'rejected';
    value = v;

    let chainableValue = value;
    rejects.forEach(f => chainableValue = f(chainableValue || value));
    rejects = [];
    //console.log(this, state, value, rejects);
  }

  try {
    executor(this.resolve, this.reject);
  } catch(e) {
    if(state !== 'fulfilled')
      this.reject(e);
  }
}
Promise.resolve = function(v) {
  let p;
  if(v instanceof Promise)
    p = v;
  else if(v.then)
    p = new Promise(v.then)
  else
    p = new Promise(resolve => resolve(v));
  return p;
}


// test then
var p1 = new Promise(function(resolve, reject) {
  //resolve("Success!");
  // or
  reject ("Error!");
});

p1.then(function(value) {
  console.log(value); // Success!
}, function(reason) {
  console.log(reason); // Error!
});

// test then chainable
var p2 = new Promise(function(resolve, reject) {
  resolve(1);
});

p2.then(function(value) {
  console.log("first", value); // 1
  return value + 1;
}).then(function(value) {
  console.log("second", value); // 2
});

p2.then(function(value) {
  console.log("third", value); // 1
});

// test composition
function fetch() {
  var p = new Promise(function(resolve, reject) {
    setTimeout(resolve, 0);
  });
  return p;
}
var p3 = function() {
  return fetch().then(() => {
    return "innerValue";
  });
}
p3().then(function(value) {
  console.log(value);
})

// test static resolve
Promise.resolve("Success - static resolve").then(function(value) {
  console.log(value); // "Success"
}, function(value) {
  throw new Error("Should not be called")// not called
});
var p4 = Promise.resolve([1,2,3]);
p4.then(function(v) {
  console.log(v[0]); // 1
});
var original = Promise.resolve(true);
var cast = Promise.resolve(original);
cast.then(function(v) {
  console.log(v); // true
});

// test Resolving a thenable object
var p5 = Promise.resolve({
  then: function(onFulfill, onReject) { onFulfill("fulfilled!"); }
});
console.log(p5 instanceof Promise) // true, object casted to a Promise
p5.then(function(v) {
    console.log(v); // "fulfilled!"
  }, function(e) {
    throw new Error("Should not be called"); // not called
});

// Thenable throws before callback
// Promise rejects
var thenable = { then: function(resolve) {
  throw new TypeError("Throwing");
  resolve("Resolving");
}};

var p6 = Promise.resolve(thenable);
p6.then(function(v) {
  throw new Error("Should not be called"); // not called
}, function(e) {
  console.log(e); // TypeError: Throwing
});

// Thenable throws after callback
// Promise resolves
var thenable = { then: function(resolve) {
  resolve("Resolving");
  throw new TypeError("Throwing");
}};
var p7 = Promise.resolve(thenable);
p7.then(function(v) {
  console.log(v); // "Resolving"
}, function(e) {
  throw new Error("Should not be called"); // not called
});
