"use strict"

const tap = require("tap")
const Functor = require("./Functor")
const curry = require("./curry")
const partial = require("./partial")
const flip = f => (b,a) => f(a,b)
const fmap = Functor.fmap
const Just = Functor.Just
Just.prototype.applicative = function(F2){
  return fmap( this.fmap(identity), F2 )
}
const List = Functor.List
List.prototype.applicative = function(F2) {
  return this.fmap(f => fmap(f , F2 ))
    .reduce((x, xs) => x.concat(xs))
}
const identity = x => x
const plus3 = x => x + 3
const multiply2 = x => x * 2

const liftA2 = function(F1, F2) {
	return F1.applicative(F2)
}
tap.throws( () => fmap(Just(plus3), Just(2)), TypeError, "ERROR ??? WHAT DOES THIS EVEN MEAN WHY IS THE FUNCTION WRAPPED IN A JUST")

tap.like( liftA2(Just(plus3), Just(2) ), 5, "Applicatives knows how to apply a function wrapped in a context to a value wrapped in a context.")

console.log( liftA2( new List(multiply2), new List(21) ) )
console.log( liftA2( new List(multiply2, plus3), new List(1,2,3) ) )
tap.like(
  liftA2( new List(multiply2), new List(21) )
  , [42], "Applicatives knows how to apply a function wrapped in a context to a value wrapped in a context.")

tap.like(
  liftA2( new List(multiply2, plus3), new List(1,2,3) )
  , [2, 4, 6, 4, 5, 6], "Applicatives knows how to apply a function wrapped in a context to a value wrapped in a context.")


// const getTitles = liftA2( fmap(getPostTitle, findPost(1)), fmap(getPostTitle, findPost(2)) )
// getTitles()
// tap.like( getTitles(), 'Anakia', "findPost sometimes return null but the return value will always be wrapped in a Maybe")


function getPostTitle (post) { return post.title }
function findPost(n) {
  return Maybe(
    n === 1 ? { title: 'Anakia' } : null
  )
}