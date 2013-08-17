/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
var test = require("assert");

var a = ["even","odd","even","odd","even","odd","even","odd","even","odd","even","odd","even","odd"];
var length = a.length;

require("../lib/Array.iterators");

a.odd(function(element, i, all) {
	test.equal(element, "odd");
	test.strictEqual(all.length, length);
	// console.log(i, element, all.length - 1);
});

a.even(function(element, i, all) {
	test.equal(element, "even");
	test.strictEqual(all.length, length);
	// console.log(i, element, all.length - 1);
});

test.throws(function() {
  a.transform();
});
test.throws(function() {
  a.transform(123, "foo");
});
test.throws(function() {
  a.transform({});
});
test.doesNotThrow(function() {
  a.transform(a.even, a.odd);
});

a.transform(a.even, function(value){
  test.equal(value, "even");
});

a.transform(a.odd, function(value){
  test.equal(value, "odd");
});

test.deepEqual(
  a.transform(a.filter, function(value) {
    return value === "odd";
  }),
  a.filter(function(value) {
    return value === "odd";
  })
);

function power2(number) {
  return Math.pow(number, 2);
}
function add1(number) {
  console.log(arguments);
  return ++number;
}
function remove1(number) {
  return --number;
}
var numbers = [1,2,300,4];
var resultOfNumbers = [3, 8, 90600, 24];
test.deepEqual(numbers.transform2(add1, power2, remove1), resultOfNumbers);
//failing: test.deepEqual(numbers.transform(add1, power2, remove1), resultOfNumbers);

var strings = ["hello"];
function addWorld(string) {
  return string + " world";
}
test.deepEqual(strings.transform2(addWorld), ["hello world"]);
strings.push("heal the");
test.deepEqual(strings.transform2(addWorld), ["hello world", "heal the world"]);

