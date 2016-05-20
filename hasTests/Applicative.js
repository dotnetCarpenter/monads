"use strict"

const tap = require("tap")
const f = require("./Functor")
const curry = require("./curry")
const fmap = f.fmap
const Just = f.Just
const List = f.List

const identity = x => x
const plus3 = x => x + 3
const multiply2 = x > x * 2

const applicative = function(f, value) {
	
	return F.fmap(identity)(value)
}

const liftA2 = function(F1, F2, f = identity) {
	return applicative(fmap(f, F1), fmap(f, F2))
}
tap.throws( () => fmap(Just(plus3), Just(2)), TypeError, "ERROR ??? WHAT DOES THIS EVEN MEAN WHY IS THE FUNCTION WRAPPED IN A JUST")

tap.like(liftA2(Just(plus3), Just(2)), 5, "Applicatives knows how to apply a function wrapped in a context to a value wrapped in a context.")
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