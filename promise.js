'use strict';

const assert = require("assert");

function Promise(executor) {
  let thenables = [];
  let rejects = [];
  let catches = [];
  let states = {
    pending: 1,
    fulfilled: 2,
    rejected: 4
  }
  let state = states.pending;
  let value;
  let timer;

  this.then = (f, r) => {
    if(timer)
      timer = clearTimeout(timer);
    thenables.push(f);
    rejects.push(r);

    if(state === states.fulfilled)
      timer = setTimeout(this.resolve.bind(this, value), 0);
    else
    if(state === states.rejected)
      timer = setTimeout(this.reject.bind(this, value), 0);

    return this;
  };
  this.resolve = v => {
    state = states.fulfilled;
    value = v;

    let chainableValue = value;
    thenables.forEach(f => {
      try {
        chainableValue = f(chainableValue || value)
      } catch(e) {
        if(catches.length === 0)
          this.reject(e);
        else {
          catches.forEach(f => f(e));
          catches = [];
        }
      }
    });
    thenables = [];
  };
  this.reject = v => {
    state = states.rejected;
    value = v;

    let chainableValue = value;
    let error;
    try {
      rejects.forEach(f => chainableValue = f(chainableValue || value));
    } catch(e) { error = e;}
    rejects = [];
    if(error) throw error;
    // console.log(this, state, value, rejects);
  };
  this.catch = f => {
    catches.push(f);
    return this;
  };

  try {
    executor(this.resolve, this.reject);
  } catch(e) {
    if(state !== states.fulfilled)
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
Promise.reject = function(v) {
  return new Promise((resolve, reject) => reject(v));
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

// test static reject
Promise.reject("Testing static reject").then(function(reason) {
  throw new Error("Should not be called"); // not called
}, function(reason) {
  console.log(reason); // "Testing static reject"
});
Promise.reject(new Error("fail")).then(function(error) {
  throw new Error("Should not be called"); // not called
}, function(error) {
  console.log(error); // Stacktrace
});

// test catch
var p8 = new Promise(function(resolve, reject) {
  resolve('Success');
});
p8.then(function(value) {
  console.log(value); // "Success!"
  throw 'oh, no!';
}).catch(function(e) {
  console.log(e); // "oh, no!"
}).then(function(e){
  console.log('after a catch the chain is restored');
}, function () {
  console.log('Not fired due to the catch');
});
// The following behaves the same as above
p8.then(function(value) {
  console.log(value); // "Success!"
  return Promise.reject('oh, no!');
}).catch(function(e) {
  console.log(e); // "oh, no!"
}).then(function(e){
  console.log('after a catch the chain is restored');
}, function () {
  console.log('Not fired due to the catch');
});
