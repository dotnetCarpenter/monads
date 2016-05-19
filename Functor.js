'use strict'

// http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html
// run with node  --harmony_rest_parameters Functor.js

const tap = require("tap")

// Test function
const plus3 = x => x+3

// Functors
const fmap = (f, F) => {
  if(F instanceof Nothing) return F
  if(F instanceof List) return F.fmap(fmap.bind(null, f))
  return F.fmap((f(F.val)))
}
function Just(val) {
  if(!new.target) return new Just(val)
  this.val = val
  this.fmap = x => new Just(x)
}
function Maybe(val) {
  if(val == undefined) return new Nothing
  return new Just(val)
}
function Nothing() {
  if(!new.target) return new Nothing
  this.fmap = x => new Nothing
}
class List extends Array {
  constructor(...args) {
    super(...args.map(x => Maybe(x)))    
  }
  fmap(f) {
    return this.map(f)
  }
}

// Tests
tap.like( fmap(plus3, Just(2)), {val:5,fmap:Function}, "fmap knows how to apply functions to values that are wrapped in a context.")
tap.like( fmap(plus3, Nothing()), {val:undefined,fmap:Function}, "you start with Nothing, and you end up with Nothing!")
tap.like( fmap(plus3, Maybe(2)), {val:5,fmap:Function}, "Maybe is a Functor. It specifies how fmap applies to Justs and Nothings.")
tap.like( fmap(plus3, Maybe()), {val:undefined,fmap:Function}, "Maybe is a Functor. It specifies how fmap applies to Justs and Nothings.")


console.log('Run findPost two times. findPost sometimes return null but the return value will always be wrapped in a Maybe')
console.log(
  fmap(getPostTitle, findPost(1)),
  fmap(getPostTitle, findPost(1))
)

console.log('What happens when you apply a function to a list')
tap.like( fmap(plus3, new List(2,4,6)) , [{val:5,fmap:Function},{val:7,fmap:Function},{val:9,fmap:Function}] , "should be Just objects with a value plus 3 higher than input." )
// console.log(
//   new List(2,4,6)
// )
// console.log(
//   fmap(plus3, new List(2,4,6))
// )

function getPostTitle (post) { return post.title }
function findPost(n) {
  return new Maybe(
    Math.round(Math.random()) ? { title: 'Anakia' } : null
  )
}