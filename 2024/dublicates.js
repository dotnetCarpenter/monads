"use strict"

// postfix ? signifies a nullable value
// e.g. a? is either a or null

// 	  head :: [a] -> a
const head = as => as[0]

//    tail :: [a] -> [a]
const tail = as => as.slice (1)

//    push :: [a] -> a -> [a]
const push = cs => c => (cs.push (c), cs)

//    isIn :: [a] -> a -> Boolean
const isIn = cs => c => Boolean (cs.indexOf (c) > -1)

//    iterator :: (a -> a?) -> a -> a
const iterator = f => str => f (head (str)) === null
								? iterate (f)
									      (tail (str))
								: head (str)

//    iterate :: (a -> a?) -> a -> a
const iterate = f => str => str === ""
							? "Not found"
							: iterator	(f)
										(str)

//    dupl2 :: a -> a
const dupl2 = str => {
	const seen = []
	const isSeen = isIn (seen)
	const addToSeen = push (seen)

	return iterate (c => isSeen (c)
							? c
							: (addToSeen (c), null))
				   (str)
}

function dupl1 (str) {
	const seen = []
	const isSeen = isIn (seen)
	const addToSeen = push (seen)
	let c = ""

	for (var i = 0, max = str.length; i < max; ++i) {
		c = head (str)
		str = tail (str)
		if (isSeen (c)) {
			return c
		} else {
			addToSeen (c)
		}
	}

	return "Not found"
}

const test1 = "lollipop"
const test2 = "abcdefcf"
const test3 = "abc"
let ts = new Array (3)

console.time ("dupl1")
ts[0] = dupl1 (test1)
ts[1] = dupl1 (test2)
ts[2] = dupl1 (test3)
console.timeEnd ("dupl1")
console.debug (...ts)

console.time ("dupl2")
ts[0] = dupl2 (test1)
ts[1] = dupl2 (test2)
ts[2] = dupl2 (test3)
console.timeEnd ("dupl2")
console.debug (...ts)
