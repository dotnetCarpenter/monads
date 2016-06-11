"use strict"

module.exports = compose

/**
 * @param {function[]} listeners
 */
function compose(...listener) {
  let listeners = []
  listeners.push(...listener)
  return (x) => {
    for(let i = 0, len = listeners.length; i < len; i++)
      x = listeners[i](x)
    return x
  }
}