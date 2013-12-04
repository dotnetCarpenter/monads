function identity(value) {
  this.value = value;
}
identity.prototype.bind = function bind(id, fn) {
  return fn.call(id, id.value)
}
identity.prototype.unit = function unit(value) {
  return new this.constructor(value)
}


// wadler essence
function lam(list) {
  return list[0] + list[1]
}
function h() {
  return 10 + 11;
}

var m = new identity([10,11]);
var k = new identity();
console.log(
  k.bind(k.unit([10,11]), lam) === lam([10, 11]),
  equal( k.bind(k, k.unit) ).to(k)
  //m.bind(m, function x() { return m.bind(lam(x), [10,11]) }) === m.bind(m.bind(m, function x() { return lam(x) }), function y() { return [10,11] })
  //, m.bind(m, function x() { return m.bind(lam(x), [10,11]) })
  ,
  m.bind(m, function(x){ return m.bind(lam(x), function(y){ return h(y)}) })
  ===
  m.bind(m.bind(m, function(x){ return lam(x) }), function(y){ return h(y) })
);

// var term0 = function app(x,y) {
//   var monad = new identity();
//   var value = [x,y];
//   return monad.bind(monad.unit(value), lam) + lam(value)
// }(10,11);
// console.log(
//   term0
// )
// var m = new identity();
// var r = m.bind(m.unit(5),
//                 function(x) {
//                   return m.bind(m.unit(6), function(y){
//                     return m.unit(x + y)
//                   }
//                 )}
//               );
// console.log(r.value)

// function k(a) {
//   return a*a
// }
// function h(b) {
//   return b/(b-1)
// }


// function x() {
//   return m.bind(lam(x), )
// }

// function y() {
//   return function() { }(y)
// }

// function x(x1,x2) {
//   return x1*x2;
// }
// function y(y1, y2) {
//   return y2/(y1);
// }
// function h(h) {
//   return h+h;
// }

// test
function equal(obj1) {
  return {
    to: function(obj2) {
      return Object.keys(obj1).every(function(prop) {
        return prop in obj2;
      })
    }
  }
}
