"use strict"

const tap = require("tap")
const Functor = require("./Functor")
// const curry = require("./curry")
const partial = require("./partial")
// const flip = f => (b,a) => f(a,b)
const fmap = Functor.fmap
const Just = Functor.Just
Just.prototype.applicative = function(F2){
  return fmap( this.fmap(identity), F2 )  
  // return fmap( partial( this.fmap(identity) ), F2 )
}
const List = Functor.List
List.prototype.applicative = function(F2) {
  return this.fmap(f => fmap(f , F2 ))
    .reduce((x, xs) => x.concat(xs))
}
const Maybe = Functor.Maybe
// Maybe.prototype.applicative = function(F2) {
//   return this.applicative(F2)
// }
const Nothing = Functor.Nothing
Function.prototype.applicative = function(F2) {
  // make partial of this
  // call partial with F2.fmap
  // return result of partial with F2.fmap values
  const p = partial(this)
  const value = F2.fmap(p)
  return F2 instanceof List ? value.slice(-1)[0] : value
  
  // return F2.fmap( partial( Function.prototype.fmap(F2.fmap) ) )
}

const identity = x => x
const plus3 = x => x + 3
const multiply2 = x => x * 2

const liftA2 = function(F1, F2) {
	return F1.applicative(F2)
}
tap.throws( () => fmap(Just(plus3), Just(2)), TypeError, "ERROR ??? WHAT DOES THIS EVEN MEAN WHY IS THE FUNCTION WRAPPED IN A JUST")

tap.like( liftA2(Just(plus3), Just(2) ), 5, "Applicatives knows how to apply a function wrapped in a context to a value wrapped in a context.")

// console.log( liftA2( new List(multiply2), new List(21) ) )
// console.log( liftA2( new List(multiply2, plus3), new List(1,2,3) ) )
tap.like(
  liftA2( new List(multiply2), new List(21) )
  , [42], "Applicatives knows how to apply a function wrapped in a context to a value wrapped in a context.")

tap.like(
  liftA2( new List(multiply2, plus3), new List(1,2,3) )
  , [2, 4, 6, 4, 5, 6], "Applicatives knows how to apply a function wrapped in a context to a value wrapped in a context.")


tap.equal( liftA2( (a,b) => a*b, new List(5,3) ), 15, "Functions are applicatives too!" )
tap.throws( () => liftA2((a,b) => a*b, new List(5,3,2) ), RangeError, "Calling a function with too many arguments throws a RangeError" )
tap.equal( liftA2( (a,b,c) => a*b*c, new List(5,3,2) ), 30, "Functions are applicatives too!" )
tap.equal( liftA2( plus3, Just(2) ), 5, "Functions are applicatives too!" )
tap.like( liftA2( plus3, Maybe(null) ), Nothing, "Functions are applicatives too!" )

// const getTitle = liftA2( Maybe(fmap(getPostTitle, findPost(1))), Maybe(fmap(getPostTitle, findPost(2))) )
// getTitles()
// tap.like( getTitles(), 'Anakia', "findPost sometimes return null but the return value will always be wrapped in a Maybe")
// function getPostTitle (post) { return post.title }
// function findPost(n) {
//   return Maybe(
//     n === 1 ? { title: 'Anakia' } : null
//   )
// }