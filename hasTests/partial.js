"use strict"

module.exports = partial

const tap = require("tap")
const curry = require("./curry")
const add = (a,b, c) => a + b + c

function partial(f) {}

tap.equal( curry(add)(1)(2)(3), 6, "should be equal to 6")
let a = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
const take = (n, list, accu = []) => {
	if(n === 0) return accu
	accu.push(list[0])
	return take( n - 1, list.slice(1), accu )
}

const take5 = curry(take)(5)

tap.same(take(5, a), take5(a))

