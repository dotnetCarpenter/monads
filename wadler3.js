"use strict";

const l = console.log;
let term0 = App(
							Lam("x"),
							Add( Var("x"), Var("x") ),
							Add( Con(10), Con(11) )
						);

function App() {}
function Lam() {}
function Add() {}
function Var() {}
function Con() {}
function Wrong() {}

function Name() { return "String"; }
function Environment() { return [Name, Value]; }
let Value; //= Wrong || Number || Value => new M(Value)

function showval(Value) {
	if(Value instanceof Wrong) return "<wrong>";

}

function M() {

}
// unitM :: a -> M a
M.prototype.unitM = function unitM (a) {
	return new M(a);
}
// bindM :: M a -> (a -> M b) -> M b
M.prototype.bindM = function bindM (Ma) {
	return this.unitM(Ma());
}

// compose two functions
// k :: a -> b and h :: b -> c
const k = a => a * 0.3776421
const h = a => a + "b"
// \a -> let b = k a in h b
let c = (function(a) {
	let b = k(a);
	return h(b);
}(1));
l(c);
