!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self);var o=f;o=o.folktale||(o.folktale={}),o=o.data||(o.data={}),o.Maybe=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
// Copyright (c) 2013-2014 Quildreen Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = _dereq_('./maybe')
},{"./maybe":2}],2:[function(_dereq_,module,exports){
// Copyright (c) 2013-2014 Quildreen Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * @module lib/maybe
 */
module.exports = Maybe

// -- Aliases ----------------------------------------------------------
var clone         = Object.create
var unimplemented = function(){ throw new Error('Not implemented.') }
var noop          = function(){ return this                         }

// -- Implementation ---------------------------------------------------

/**
 * A structure for values that may not be present, or computations that may
 * fail. `Maybe(a)` explicitly models the effects that are implicit in
 * `Nullable` types, thus has none of the problems associated with
 * `null` or `undefined` — like `NullPointerExceptions`.
 *
 * The class models two different cases:
 *
 *  + `Just a` — represents a `Maybe(a)` that contains a value. `a` may
 *     be any value, including `null` or `undefined`.
 *
 *  + `Nothing` — represents a `Maybe(a)` that has no values. Or a
 *     failure that needs no additional information.
 *
 * Common uses of this structure includes modelling values that may or may
 * not be present in a collection, thus instead of needing a
 * `collection.has(a)`, the `collection.get(a)` operation gives you all
 * the information you need — `collection.get(a).is-nothing` being
 * equivalent to `collection.has(a)`; Similarly the same reasoning may
 * be applied to computations that may fail to provide a value, e.g.:
 * `collection.find(predicate)` can safely return a `Maybe(a)` instance,
 * even if the collection contains nullable values.
 *
 * Furthermore, the values of `Maybe(a)` can be combined and manipulated
 * by using the expressive monadic operations. This allows safely
 * sequencing operations that may fail, and safely composing values that
 * you don't know whether they're present or not, failing early
 * (returning a `Nothing`) if any of the operations fail.
 *
 * If one wants to store additional information about failures, the
 * [Either][] and [Validation][] structures provide such a capability, and
 * should be used instead of the `Maybe(a)` structure.
 *
 * [Either]: https://github.com/folktale/data.either
 * [Validation]: https://github.com/folktale/data.validation
 *
 *
 * @class
 */
function Maybe() {}

// The case for successful values
Just.prototype = clone(Maybe.prototype)
function Just(a){
  this.value = a
}

// The case for failure values
Nothing.prototype = clone(Maybe.prototype)
function Nothing(){}


// -- Constructors -----------------------------------------------------

/**
 * Constructs a new `Maybe[α]` structure with an absent value. Commonly used
 * to represent a failure.
 *
 * @summary Void → Maybe[α]
 */
Maybe.Nothing = function() {
  return new Nothing
}
Maybe.prototype.Nothing = Maybe.Nothing

/**
 * Constructs a new `Maybe[α]` structure that holds the single value
 * `α`. Commonly used to represent a success.
 *
 * `α` can be any value, including `null`, `undefined` or another
 * `Maybe[α]` structure.
 *
 * @summary α → Maybe[α]
 */
Maybe.Just = function(a) {
  return new Just(a)
}
Maybe.prototype.Just = Maybe.Just


// -- Conversions ------------------------------------------------------

/**
 * Constructs a new `Maybe[α]` structure from a nullable type.
 *
 * If the value is either `null` or `undefined`, this function returns a
 * `Nothing`, otherwise the value is wrapped in a `Just(α)`.
 *
 * @summary α → Maybe[α]
 */
Maybe.fromNullable = function(a) {
  return a != null?       new Just(a)
  :      /* otherwise */  new Nothing
}
Maybe.prototype.fromNullable = Maybe.fromNullable

Maybe.fromEmpty = function (a) {
    return a != null && a.length
        ? new Just(a)
        : new Nothing;
}
Maybe.prototype.fromNullable = Maybe.fromNullable

Maybe.fromBool = function (a) {
    return a != null && a
        ? new Just(a)
        : new Nothing;
}
Maybe.prototype.fromBool = Maybe.fromBool

/**
 * Constructs a new `Maybe[β]` structure from an `Either[α, β]` type.
 *
 * The left side of the `Either` becomes `Nothing`, and the right side
 * is wrapped in a `Just(β)`.
 *
 * @summary Either[α, β] → Maybe[β]
 */
Maybe.fromEither = function(a) {
  return a.fold(Maybe.Nothing, Maybe.Just)
}
Maybe.prototype.fromEither = Maybe.fromEither

/**
 * Constructs a new `Maybe[β]` structure from a `Validation[α, β]` type.
 *
 * The failure side of the `Validation` becomes `Nothing`, and the right
 * side is wrapped in a `Just(β)`.
 *
 * @method
 * @summary Validation[α, β] → Maybe[β]
 */
Maybe.fromValidation           = Maybe.fromEither
Maybe.prototype.fromValidation = Maybe.fromEither


// -- Predicates -------------------------------------------------------

/**
 * True if the `Maybe[α]` structure contains a failure (i.e.: `Nothing`).
 *
 * @summary Boolean
 */
Maybe.prototype.isNothing   = false
Nothing.prototype.isNothing = true


/**
 * True if the `Maybe[α]` structure contains a single value (i.e.: `Just(α)`).
 *
 * @summary Boolean
 */
Maybe.prototype.isJust = false
Just.prototype.isJust  = true


// -- Applicative ------------------------------------------------------

/**
 * Creates a new `Maybe[α]` structure holding the single value `α`.
 *
 * `α` can be any value, including `null`, `undefined`, or another
 * `Maybe[α]` structure.
 *
 * @summary α → Maybe[α]
 */
Maybe.of = function(a) {
  return Maybe.prototype.Just(a)
}

//Maybe.of will respect null,undefined
Maybe.of = Maybe.fromNullable

Maybe.prototype.of = Maybe.of



/**
 * Applies the function inside the `Maybe[α]` structure to another
 * applicative type.
 *
 * The `Maybe[α]` structure should contain a function value, otherwise a
 * `TypeError` is thrown.
 *
 * @method
 * @summary (@Maybe[α → β], f:Applicative[_]) => f[α] → f[β]
 */
Maybe.prototype.ap = unimplemented

Nothing.prototype.ap = noop

Just.prototype.ap = function(b) {
  return b.map(this.value)
}




// -- Functor ----------------------------------------------------------

/**
 * Transforms the value of the `Maybe[α]` structure using an unary function
 * to monads.
 *
 * @method
 * @summary (@Maybe[α]) => @Maybe[b] → ((α,β) → c) → Maybe[c]
 */
Nothing.prototype.choose = function(b) {
    return b.isJust && b.value?  b : new Nothing;
}
Just.prototype.choose = function (b, f) {
    return b.isJust && b.value ? this.of(f(this.value, b.value)) : this;
}


/**
 * Transforms the value of the `Maybe[α]` structure using a regular unary
 * function.
 *
 * @method
 * @summary @Maybe[α] => (α → β) → Maybe[β]
 */
Maybe.prototype.map   = unimplemented
Nothing.prototype.map = noop

Just.prototype.map = function(f) {
  return this.of(f(this.value))
}


// -- Chain ------------------------------------------------------------

/**
 * Transforms the value of the `Maybe[α]` structure using an unary function
 * to monads.
 *
 * @method
 * @summary (@Maybe[α], m:Monad[_]) => (α → m[β]) → m[β]
 */
Maybe.prototype.chain   = unimplemented
Nothing.prototype.chain = noop

Just.prototype.chain = function(f) {
  return f(this.value)
}


// -- Show -------------------------------------------------------------

/**
 * Returns a textual representation of the `Maybe[α]` structure.
 *
 * @method
 * @summary @Maybe[α] => Void → String
 */
Maybe.prototype.toString = unimplemented

Nothing.prototype.toString = function() {
  return 'Maybe.Nothing'
}

Just.prototype.toString = function() {
  return 'Maybe.Just(' + this.value + ')'
}


// -- Eq ---------------------------------------------------------------

/**
 * Tests if a `Maybe[α]` structure is equal to another `Maybe[α]` structure.
 *
 * @method
 * @summary @Maybe[α] => Maybe[α] → Boolean
 */
Maybe.prototype.isEqual = unimplemented

Nothing.prototype.isEqual = function(b) {
  return b.isNothing
}

Just.prototype.isEqual = function(b) {
  return b.isJust
  &&     b.value === this.value
}


// -- Extracting and recovering ----------------------------------------

/**
 * Extracts the value out of the `Maybe[α]` structure, if it
 * exists. Otherwise throws a `TypeError`.
 *
 * @method
 * @summary @Maybe[α] => Void → a,      :: partial, throws
 * @see {@link module:lib/maybe~Maybe#getOrElse} — A getter that can handle failures
 * @throws {TypeError} if the structure has no value (`Nothing`).
 */
Maybe.prototype.get = unimplemented

Nothing.prototype.get = function () {
  if(console && console.error) console.error("Can't extract the value of a Nothing.");
  return undefined;
}

Just.prototype.get = function() {
  return this.value
}


/**
 * Extracts the value out of the `Maybe[α]` structure. If there is no value,
 * returns the given default.
 *
 * @method
 * @summary @Maybe[α] =>  α → α
 */
Maybe.prototype.getOrElse = unimplemented


Nothing.prototype.getOrElse = function (f) {
    if (f && typeof (f) == "function") return f();
    return f;
}

Just.prototype.getOrElse = function(_) {
  return this.value
}


/**
 * Transforms a failure into a new `Maybe[α]` structure. Does nothing if the
 * structure already contains a value.
 *
 * @method
 * @summary @Maybe[α] => (Void → Maybe[α]) → Maybe[α]
 */
Maybe.prototype.orElse = unimplemented

Nothing.prototype.orElse = function (f) {
    if (f && typeof (f) == "function") return f();
    return f;
}

Just.prototype.orElse = function(_) {
  return this
}


/**
 * Catamorphism.
 * 
 * @method
 * @summary @Maybe[α] => { Nothing: Void → β, Just: α → β } → β
 */
Maybe.prototype.cata = unimplemented

Nothing.prototype.cata = function (pattern) {
  return pattern.Nothing()
}

Just.prototype.cata = function (pattern) {
  return pattern.Just(this.value);
}


/**
 * JSON serialisation
 *
 * @method
 * @summary @Maybe[α] => Void → Object
 */
Maybe.prototype.toJSON = unimplemented

Nothing.prototype.toJSON = function () {
  return { '#type': 'folktale:Maybe.Nothing' }
}

Just.prototype.toJSON = function () {
  return {
    '#type': 'folktale:Maybe.Just'
       , value: this.value
  }
}

},{}]},{},[1])
(1)
});
