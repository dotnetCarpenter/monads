"use strict"

const tap = require("tap")

const partial = require("./partial")
const compose = require("./compose")

const split = partial((seperator, string) => string.split(seperator))
const length = x => x.length

const wordcount =  compose(length, split(" "))

tap.equal(wordcount("There are seven words in this sentence"), 7, "There are seven words in this sentence")

//FIXME: partial will fail because the accumulator is not emptied - look into only returning functions without an accumulator
const commaCount = compose(length,split(","))
tap.equal(commaCount("fds,fdsgf,dsg,sdg,fdh,df,hsdf,hfd,s"), 9, "There are 9 commas in this sentence")  