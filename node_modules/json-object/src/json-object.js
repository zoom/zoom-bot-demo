/* json-object.js -- Extends JSON to support isolated objects
 * Copyright 2010, 2011 Jaakko-Heikki Heusala <jhh@jhh.me>
 * https://github.com/jheusala/node-json-object
 */

/*
 * Copyright (C) 2010, 2011 by Jaakko-Heikki Heusala <jheusala@iki.fi>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of 
 * this software and associated documentation files (the "Software"), to deal in 
 * the Software without restriction, including without limitation the rights to 
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
 * of the Software, and to permit persons to whom the Software is furnished to do 
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all 
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
 */

/* Exports for Node.js */
module.exports = (function() {
	var _mod = {};
	
/** Special element constructor for JSON to implement extended object serialization
 * @params name string Name of the object constructor
 * @params value string Objects data
 */
function JSONObject (name, value, as_string) {
	var undefined;
	if(this instanceof arguments.callee) {
		if(name === undefined) throw TypeError("name undefined");
		if(value === undefined) throw TypeError("value undefined");
		this.name = ""+name;
		if(as_string || (typeof value === 'string') || (value instanceof String) ) {
			this.type = "s";
			this.value = ""+value;
		} else {
			this.type = "j";
			this.value = _mod.stringify(value);
		}
	} else {
		return new JSONObject(name, value, as_string);
	}
}

/** Check if the value should be presented in the extended format
 * @params v String value to test
 * @returns true if should use extended format, false otherwise.
 */
JSONObject.__use_extended_format = function(v) {
	var l = v.length;
	return (l < 2) ? false : (((v.charAt(l-1) === ")") && (v.indexOf("(") !== -1)) ? true : false);
}

/** Check if the value should be presented in the extended format
 * @returns true if should use extended format, false otherwise.
 */
JSONObject.prototype.__use_extended_format = function() {
	if(this.name !== "String") return true;
	return JSONObject.__use_extended_format(this.value);
}

/** The valueOf() method returns the primitive value of a JSONObject. */
JSONObject.prototype.valueOf = function() {
	if(this.__use_extended_format()) return this.name + "(" + this.type + ":" + this.value + ")";
	return this.value;
};

/** Revives JSONObject back to the original value
 * @returns instance of same type as the original JavaScript object
 */
JSONObject.prototype.reviver = function() {
	if(! ( JSONObject.revivers[this.name] && (typeof JSONObject.revivers[this.name] === "function") )) {
		throw new ReferenceError("could not find reviver for " + this.name);
	}
	var type = this.type,
	    value = (type === "j") ? _mod.parse(this.value) : this.value;
	return (JSONObject.revivers[this.name])(value);
};

/** Convert JSONObject as JSON string
 * @note We need to use our own replacer to isolate normal strings and the 
         extended from each other, therefore it has no .toJSON().
JSONObject.prototype.toJSON = function() {
	return this.name + "(" + this.value + ")";
};
*/

/* JSONObject revivers */
JSONObject.revivers = {};

/* Override global .toJSON()'s to support our extended JSONObject */
function do_override_globals(g, minimal) {
	var exceptions = ["Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"];
	
	g.String.prototype.toJSON    = function() { return new JSONObject("String", this.valueOf(), true ); };
	JSONObject.revivers.String = function(value) { return ""+value; };
	
	// Exit now if the user wanted only minimal global polution
	if(minimal) return;
	
	g.Date.prototype.toJSON      = function() { return new JSONObject("Date",   this.getTime(), true ); };
	JSONObject.revivers.Date   = function(value) {
		if(/^[0-9]+$/.test(value)) return new Date(parseInt(value, 10));
		throw TypeError("illegal value: "+value);
	};
	
	/* Setup all exceptions with .toJSON() and revivers */
	for(var i in exceptions) if(exceptions.hasOwnProperty(i)) {
		(function(name) {
			g[name].prototype.toJSON = function() { return new JSONObject(name, this.message, true); };
			JSONObject.revivers[name] = function(value) { return new (g[name])(value); };
		})(exceptions[i]);
	}
}

/** Replacer to implement support for JSONObject extension
 * @throws TypeError if a string is detected, because all normal strings should 
 *         have been converted to JSONObject by their .toJSON().
 */
JSONObject.replacer = function(key, value) {
	if(typeof value === "string") return JSONObject("String", value).valueOf();
	if(value && (typeof value === "object") && (value instanceof JSONObject) ) return value.valueOf();
	return value;
};

/** Convert primitive presentation back to an object
 * @params value String Primitive presentation of JSONObject in format "ClassName(Value)"
 * @returns new instance of the JSONObject
 * @throws TypeError if illegal string content is detected.
 */
JSONObject.parse = function(value) {
	var value, items, name, data, arg, type;
	
	value = ""+value;
	if(!JSONObject.__use_extended_format(value)) return new JSONObject("String", value, true);
	
	items = value.split("(");
	if(items.length < 2) throw new TypeError("illegal input: "+value);
	name = items.shift();
	data = items.join("(");
	if(data.charAt(data.length-1) != ')') throw new TypeError("illegal input: "+value);
	
	arg = data.substr(0, data.length-1);
	type = (arg[0] === "j") ? "j" : "s";
	if(arg[1] !== ":") throw new TypeError("illegal input: "+value);
	return new JSONObject(name, ((type === "j") ? _mod.parse(arg.substr(2)) : arg.substr(2)), ((type === "j") ? false : true) );
};

/** Reviver to implement support for JSONObject extension
 * 
 */
JSONObject.reviver = function(key, value) {
	if(typeof value !== 'string') return value;
	return JSONObject.parse(value).reviver();
};

	_mod.parse     = function(item, r) { return JSON.parse    (item, r || JSONObject.reviver);  };
	_mod.stringify = function(item, r) { return JSON.stringify(item, r || JSONObject.replacer); };
	
	_mod.JSONObject = JSONObject;
	_mod.revivers = JSONObject.revivers;
	
	var once = false;
	_mod.setup = (function(g, minimal) { 
		if(once) return _mod;
		do_override_globals(g, minimal);
		once = true;
		return _mod;
	});
	
	return _mod;
})();

/* EOF */
