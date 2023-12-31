//    identity :: a -> a
const identity = x => x

//    map :: Functor F => (a -> b) -> F a -> F b
const map = f => a => a.map (f)

//    filter :: Iterator I => (a -> Boolean) -> I a -> I a
const filter = f => a => a.filter (f)

class Nothing {
  static [Symbol.hasInstance] (maybe) {
    return maybe.isNothing
  }
}
class Just {
  static [Symbol.hasInstance] (maybe) {
    return !maybe.isNothing
  }
}

class Maybe {
  constructor (value) {
    this.__value = value
    if (value == null) this.constructor = new Nothing
    else this.constructor = new Just
  }

  static of (value) {
    return new Maybe (value)
  }

  get isNothing () {
    return this.__value == null
  }

  map (f) {
    return this.isNothing
      ? Maybe.of (null)
      : Maybe.of ( f (this.__value))
  }

  join () {
    return this.__value
  }

  chain (f) {
    return this.map (f).join ()
  }

  //TODO: implement as an Applicative
  filter (f) {
    try {
      return this.map (filter (f))
    } catch (error) {
      error.message = `Maybe (${this.__value})\nis not an Iterable since the value ${this.__value} does not have an Iterator.`
      throw error
    }
  }
}

const odd = a => a % 2 === 1
const even = a => a % 2 === 0

console.debug (
  Maybe.of (42) instanceof Just,
  Maybe.of (42) instanceof Nothing,
  Maybe.of (null) instanceof Just,
  Maybe.of (null) instanceof Nothing,
)

console.debug (
	Maybe.of ([0, 1, 2, 3]).filter (odd),

  Maybe.of (null).filter (odd),

  Maybe.of (Maybe.of ([0,1,2,3])).filter (even),

  Maybe.of (Maybe.of (null)).filter (odd),
)

console.debug (
  Maybe.of (42).filter (odd),
  Maybe.of (Maybe.of (42)).filter (odd),
)