//    flatten :: Array a -> Array a
const flatten = list => {
  if (list.length === 0) return list

  let x = list[0]
  let xs = list.slice (1)

  return Array.isArray (x)
    ? [...flatten (x), ...flatten (xs)]
    : [x, ...flatten (xs)]
}

console.log (
  flatten ([[0]]),
  flatten ([[0], [1],[2,[3]]]),
  flatten ([0,1,2,3,4,5]),
)
/*const flatten = list => {
  if (list.length === 0) return list

  let x = list[0]
  let xs = list.slice (1)
  return Array.isArray (x)
    ? x.concat (flatten (xs))
    : [x].concat (flatten (xs))
}*/
