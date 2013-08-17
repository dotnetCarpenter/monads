Array.prototype.odd = function(fn, scope) {
	for (var i = 1, len = this.length; i < len; i+=2) {
		fn.call(scope, this[i], i, this);
	};
}
Array.prototype.even = function(fn, scope) {
	for (var i = 0, len = this.length; i < len; i+=2) {
		fn.call(scope, this[i], i, this);
	};
}
Array.prototype.transform = function(/*functions*/) {
	var functions = this.splice.call(arguments, 0);
	var self = this;	// the array
	// check that all arguments are functions
	if( functions.filter(isFunction).length < functions.length )
		throw new TypeError("transform of array where all arguments isn't functions");

	return functions.reduce(function(prev, next) {
	   return prev.call(self, next);
	});
}
Array.prototype.transform2 = function(/*functions*/) {
	var functions = this.splice.call(arguments, 0);
	var tmp = null;
	// check that all arguments are functions
	if( functions.filter(isFunction).length < functions.length )
		throw new TypeError("transform of array where all arguments isn't functions");

	return this.map(function(value, i, all) {
		tmp = null;
		functions.forEach(function(fn) {
			tmp = fn(tmp || value, i, all);
		});
		return tmp;
	});
}

function isFunction(fn) {
	return fn instanceof Function;
}

module.exports = Array;
