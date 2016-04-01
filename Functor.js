'use strict'

const plus3 = x => x+3
const fmap = (f, F) => {
  if(F instanceof Nothing) return F
  return F.fmap((f(F.val)))
}
function Just(val) {
  if(this == undefined) return new Just(val)
  this.val = val
  this.fmap = x => new Just(x)
}
function Maybe(val) {
  if(val == undefined) return new Nothing
  //if(val instanceof Just) 
  return Just(val)
}
function Nothing() {
  if(this == undefined) return new Nothing
  this.fmap = x => new Nothing
}

console.log(
  'fmap(plus3, Just(2)) ->\t',
  fmap(plus3, Just(2))
)
console.log(
  'fmap(plus3, Nothing()) ->\t',
  fmap(plus3, Nothing())
)
console.log(
  'fmap(plus3, Maybe(2)) ->\t',
  fmap(plus3, Maybe(2))
)
console.log(
  'fmap(plus3, Maybe()) -> \t',
  fmap(plus3, Maybe())
)
console.log(findPost(), findPost(), findPost())
console.log(
  fmap(getPostTitle, findPost(1))
)

function getPostTitle (post) { return post.title }
function findPost(n) {
  return new Maybe(
    Math.round(Math.random()) ? { title: 'Anakia' } : null
  )
}