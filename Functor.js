"use strict"

// http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html
// run with node  --harmony_rest_parameters Functor.js

const tap = require("tap")

// Test function
const plus3 = x => x + 3
const plus2 = x => x + 2
const minus15 = x => x - 15

// Functors
// (a->b), fa -> b
const fmap = (f, F) => F.fmap( partial(f) )
const partial = f => x => f(x)

function Just(val) {
  if(!new.target) return new Just(val)
  this.fmap = f => f(val)
}

function Maybe(val) {
  return val == undefined ? new Nothing : new Just(val)
}

function Nothing() {
  if(!new.target) return new Nothing
  this.fmap = () => Nothing
}

class List extends Array {
  constructor(...args) {
    super(...args.map(x => Maybe(x)))
  }
  fmap(f) {
    return this.map(fa => fa.fmap(f))
  }
}

Function.prototype.fmap = function(f) {
  const self = this
  return x => self(f(x))
}

// Tests
tap.like( Just(2), Just, "fmap knows how to apply functions to values that are wrapped in a context.")
tap.like( fmap(plus3, Just(2)), 5, "fmap knows how to apply functions to values that are wrapped in a context.")

tap.like( fmap(plus3, Nothing()), Nothing, "you start with Nothing, and you end up with Nothing!")

tap.like( Maybe(2), Just, "Maybe is a Functor. It specifies how fmap applies to Justs and Nothings.")
tap.like( Maybe(), Nothing, "Maybe is a Functor. It specifies how fmap applies to Justs and Nothings.")
tap.like( fmap(plus3, Maybe(2)), 5, "Maybe is a Functor. It specifies how fmap applies to Justs and Nothings.")
tap.like( fmap(plus3, Maybe()), Nothing, "Maybe is a Functor. It specifies how fmap applies to Justs and Nothings.")

tap.like( fmap(getPostTitle, findPost(1)), 'Anakia', "findPost sometimes return null but the return value will always be wrapped in a Maybe")
tap.like( fmap(getPostTitle, findPost(2)), Nothing, "findPost sometimes return null but the return value will always be wrapped in a Maybe")

tap.like( new List(2,4,6) , [Just,Just,Just] , "What happens when you apply a function to a list? Should be Just objects." )
tap.like( fmap(plus3, new List(2,4,6)) , [5,7,9] , "What happens when you apply a function to a list? 3 higher than input." )
tap.like( fmap(plus3, new List(2,null,6)) , [5,Nothing,9] , "What happens when you apply a function to a list? Null values are wrapped in Nothing" )

const foo = fmap( plus3, plus2 )
tap.like(foo(10), 15, "So functions are Functors too!")

const bar = fmap( foo, minus15 )
tap.like(bar(10), 0, "So functions are Functors too!")

function getPostTitle (post) { return post.title }
function findPost(n) {
  return Maybe(
    n === 1 ? { title: 'Anakia' } : null
  )
}