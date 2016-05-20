"use strict"

module.exports = partial

const tap = require("tap")
const curry = require("./curry")
const add = (a,b, c) => a + b + c

function partial(f) {}

tap.equal( curry(add)(1)(2)(3), 6, "should be equal to 6")

