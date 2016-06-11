"use strict"

module.exports = compose

/**
 * @param {function[]} functions
 */
function compose(...functions) {
  return (x) => functions.reduceRight((x,a) => a(x), x)
}