"use strict"

module.exports = partial

const tap = require("tap")
const curry = require("./curry")
const add = (a,b, c) => a + b + c

function partial(f, ...args) {
	return curry(f).bind(f, ...args)
}

tap.equal( curry(add)(1)(2)(3), 6, "should be equal to 6")

let a = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
const take = (n, list, accu = []) => {
	if(list.length === 0 || n === 0) return accu
	accu.push(list[0])
	return take( n - 1, list.slice(1), accu )
}

const take5 = partial(take, 5)
tap.same(take5(a), take(5, a), "A dyadic function should return the same as a partial monadic function made of that dyadic function.")