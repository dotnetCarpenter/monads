'use strict'

// http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html
// run with node  --harmony_rest_parameters Functor.js

const tap = require("tap")

// Test function
const plus3 = x => x+3
const plus2 = x => x+2

// Functors
// (a->b), fa -> fb
const fmap = (f, F) => {
	// if(F instanceof Nothing) return F
  // if(F instanceof List) return F.fmap(fmap.bind(null, f))
  // return F.fmap((f(F.val)))
	return F.fmap( x => f(x) )
}
function Just(val) {
  return {
		fmap: f => f(val) 
	}
}
fmap(plus3, Just(2))
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
// Function.prototype.fmap = f => x => f(x)


// Tests
tap.like( fmap(plus3, Just(2)), {val:5,fmap:Function}, "fmap knows how to apply functions to values that are wrapped in a context.")
// tap.like( fmap(plus3, Nothing()), {val:null,fmap:Function}, "you start with Nothing, and you end up with Nothing!")
// tap.like( fmap(plus3, Maybe(2)), {val:5,fmap:Function}, "Maybe is a Functor. It specifies how fmap applies to Justs and Nothings.")
// tap.like( fmap(plus3, Maybe()), {val:undefined,fmap:Function}, "Maybe is a Functor. It specifies how fmap applies to Justs and Nothings.")


// console.log('Run findPost two times. findPost sometimes return null but the return value will always be wrapped in a Maybe')
// console.log(
//   fmap(getPostTitle, findPost(1)),
//   fmap(getPostTitle, findPost(1))
// )

// console.log('What happens when you apply a function to a list')
// tap.like( new List(2,4,6) , [{val:2,fmap:Function},{val:4,fmap:Function},{val:6,fmap:Function}] , "should be Just objects." )
// tap.like( fmap(plus3, new List(2,4,6)) , [{val:5,fmap:Function},{val:7,fmap:Function},{val:9,fmap:Function}] , "should be Just objects with a value plus 3 higher than input." )

// const foo = fmap( plus3, plus2 )
// tap.equal(foo(10), 15, "So functions are Functors too!")

function getPostTitle (post) { return post.title }
function findPost(n) {
  return new Maybe(
    Math.round(Math.random()) ? { title: 'Anakia' } : null
  )
}