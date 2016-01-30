let l = console.log
function add(a, b) {
  if(!a && !b) return add
  if(!b) return b => add(a, b)
  else return a + b
}

let add4 = add(4)
add4(6)

function curry(f /* arguments */) {
  var args = Array.prototype.slice.call(arguments, 1)
  var n = f.length - args.length
  return n
}
l(curry(add))

/*
function curry(func,args,space) {
    var n  = func.length - args.length; //arguments still to come
    var sa = Array.prototype.slice.apply(args); // saved accumulator array
    function accumulator(moreArgs,sa,n) {
        var saPrev = sa.slice(0); // to reset
        var nPrev  = n; // to reset
        for(var i=0;i<moreArgs.length;i++,n--) {
            sa[sa.length] = moreArgs[i];
        }
        if ((n-moreArgs.length)<=0) {
            var res = func.apply(space,sa);
            // reset vars, so curried function can be applied to new params.
            sa = saPrev;
            n  = nPrev;
            return res;
        } else {
            return function (){
                // arguments are params, so closure bussiness is avoided.
                return accumulator(arguments,sa.slice(0),n);
            }
        }
    }
    return accumulator([],sa,n);
}

function add (a,b,c){
      if (arguments.length < this.add.length) {
        return curry(this.add,arguments,this);
      }
      return a+b+c;
}

l(add()(1,2,4));      // 7
l(add(1)(2)(5));      // 8
l(add(1)()(2)()(6));  // 9
l(add(1,2,7,8));      // 10
*/
