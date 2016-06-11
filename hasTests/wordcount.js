"use strict"

const tap = require("tap")

const partial = require("./partial")
const compose = require("./compose")

const split = partial((seperator, string) => string.split(seperator))
const length = x => x.length

const wordcount =  compose(split(" "), length)

tap.equal(wordcount("They are seven words in this sentence"), 7, "They are seven words in this sentence")