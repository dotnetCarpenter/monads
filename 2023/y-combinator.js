"use strict"

//https://gist.github.com/Avaq/1f0636ec5c8d6aed2e45?permalink_comment_id=4811471#gistcomment-4811471
//https://stackoverflow.com/a/15906471/205696
//https://en.wikipedia.org/wiki/Fixed-point_combinator#The_factorial_function

const Y = f => (g => g (g)) (g => f (x => g (g) (x)))

const fact = n => n === 0 ? 1 : n * fact (n - 1)

// create a recursive function in an anonomous function
const YFact = Y (fact => n => n === 0 ? 1 : n * fact (n - 1))

const YPlus = Y (plus => n => m => n === 0 ? m : 1 + plus (n - 1) (m))
const plus = n => m => n === 0 ? m : 1 + plus (n - 1) (m)

// console.debug (
//     fact (4),        // <- 24
//     YFact (4),        // <- 24
//     plus (2) (2),    // <-  4
//     YPlus (2) (2),    // <-  4
// )

//                case arguments
//            /-------------------\
const True  = trueCase => falseCase => trueCase
const False = trueCase => falseCase => falseCase
//            \________________________________/
//                     boolean encoding
// Scott encoding:
// Bool  = True | False
// True  = \x _ -> x
// False = \_ y -> y
var darkMode = False
var backgroundColor = darkMode ("black") ("white") // using the `darkMode` bool
console.debug (darkMode,        // <- Function: False
               backgroundColor) // <- white

var darkMode = True
var backgroundColor = darkMode ("black") ("white") // using the `darkMode` bool
console.debug (darkMode,        // <- Function: True
               backgroundColor) // <- black



// wrapped values (constructor args)
//           /----\
const Pair = x => y => access => access (x) (y)
//                     \______________________/
//                           pair encoding
//           \--------------------------------/
//                       constructor
// Scott encoding:
// Pair x y = x -> y -> Pair x y
// Pair x y = Pairs (\f -> f x y)

const numPair = Pair (5)    (9)
const strPair = Pair ("hi") ("bye")
var   fst     = x => _ => x
var   snd     = _ => y => y
console.debug (numPair (snd), // <- 9
               strPair (snd)) // <- bye

// Fst and Snd can be substituted with True and False
// Scott encoding:
// Pair x y = \f . f x y
// True  = Fst = \x _ -> x
// False = Snd = \_ y -> y
var fst        = True
var snd        = False
console.debug (numPair (snd), // <- 9
               strPair (snd)) // <- bye

// Thanks @JohanWiltink. I vaguely remember the `.` being function composition. Is that correct?
// If `\fn . fn x y = fn (fn x y)`, then I'm lost again. My issue is that I want to be able to implement the encoding in working code. Preferably in js.
// Pair x y = (\fn x y)