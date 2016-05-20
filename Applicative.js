"use strict"

require("Functor")

const liftA2 = function(F1, F2, f) {
	return ap()
}

const getTitles = liftA2( fmap(getPostTitle, findPost(1)), fmap(getPostTitle, findPost(2)) )
getTitles()
tap.like( getTitles(), 'Anakia', "findPost sometimes return null but the return value will always be wrapped in a Maybe")


function getPostTitle (post) { return post.title }
function findPost(n) {
  return Maybe(
    n === 1 ? { title: 'Anakia' } : null
  )
}