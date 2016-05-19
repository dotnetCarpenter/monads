'use strict'

// http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html
// run with node  --harmony_rest_parameters Functor.js

// const tap = require("tap")

// Test function
const plus3 = x => x+3

// Functors

// const context = Object.create({ val: undefined, fmap })
const fmap = (f, F) => {
  // if(F.isPrototypeOf(Nothing)) return F
  // if(F instanceof List) return F.fmap(fmap.bind(null, f))
  // return F.fmap((f(F.val)))
  return F.fmap(f, F)
}
const Just = {
  val: undefined,
  fmap: (a, fa) => {
    this.val = a(fa.val) 
    return this
  }
}
// function just(val) {
//   return Object.create({fmap: (a, fa) => Just(a(fa.val))}, {
//     "val": { value: val }
//   })
// }
// function Nothing() {
//   return Object.create(Nothing, {
//     "val": { value: null },
//     fmap: (a, fa) => Nothing()
//   })
// }
// function Maybe(val) {
//   return val => val == null ? Nothing() : Just(val)
// }
const just = Object.create(Just)
just.val = 2
fmap(plus3, just)
// class List extends Array {
//   constructor(...args) {
//     super(...args.map(x => Maybe(x)))
//   }
//   fmap(f) {
//     return this.map(f)
//   }
// }

// Tests
// tap.like(fmap(plus3, Just(2)), Just(5), "fmap knows how to apply functions to values that are wrapped in a context.")
console.log(
  'fmap(plus3, Just(2))\t-> ',
  fmap(plus3, Just(2))
)
console.log(
  'fmap(plus3, Nothing())\t-> ',
  fmap(plus3, Nothing())
)
// console.log(
//   'fmap(plus3, Maybe(2))\t-> ',
//   fmap(plus3, Maybe(2))
// )
console.log(
  'fmap(plus3, Maybe())\t-> ',
  fmap(plus3, Maybe())
)

// console.log('Run findPost two times. findPost sometimes return null but the return value will always be wrapped in a Maybe')
// console.log(
//   fmap(getPostTitle, findPost(1)),
//   fmap(getPostTitle, findPost(1))
// )

// console.log('What happens when you apply a function to a list')
// console.log(
//   new List(2,4,6)
// )
// console.log(
//   fmap(plus3, new List(2,4,6))
// )

// function getPostTitle (post) { return post.title }
// function findPost(n) {
//   return new Maybe(
//     Math.round(Math.random()) ? { title: 'Anakia' } : null
//   )
// }