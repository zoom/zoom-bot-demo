JSON with extended support for custom objects
=============================================

Description
-----------

This library extends standard JSON support in JavaScript to fully support 
objects like Date. It does that by using a special format with strings but only 
when it is needed.

	           JSON                  |       JavaScript      |                             Description
	---------------------------------+-----------------------+---------------------------------------------------------------------------
	 "Hello"                         | "Hello"               | If it doesn't end ")" or doesn't have "(", it can be presented normally
	 "Date(s:1287197914000)"         | Date(1287197914000)   | Date object
	 "String(Date(s:1287197914000))" | "Date(1287197914000)" | String object
	 "UIMessage(OK)"                 | UIMessage(...)        | Custom object
	---------------------------------+-----------------------+---------------------------------------------------------------------------

Installation for Node.js
------------------------

Simplest way to install is to use [npm](http://npmjs.org/), just simply `npm install json-object`.

License
-------

MIT-style license, see [INSTALL.txt](http://github.com/jheusala/node-json-object/blob/master/LICENSE.txt).

Example Code
------------

Before using the library the `require('json-object').setup(global[, minimal])` 
has to be called to setup global objects. If `minimal` is `true`, then only 
minimal changes are done. That means only `String.prototype.toJSON` is changed.

	var json = require('json-object').setup(global);

Encoding as JSON string is done by calling `json.stringify()` in usual way:

	var data = {'date':new Date(),'msg':'Hello World!'};
	var str = json.stringify(data);
	console.log("str = " + sys.inspect(str));

Parsing is also done by calling `json.parse()` in standard way:

	var parsed_data = json.parse(str);
	console.log("parsed_data = " + sys.inspect(parsed_data));
	
Extending to support your own objects
-------------------------------------

You can also extend `json-object` to support your own objects:

	// Our custom object
	function UIMessage(msg, date) {
		this.msg = "" + msg;
		this.date = date || new Date();
	}
	
	// Extend our custom object to support json-object
	UIMessage.prototype.toJSON = (function() { return new json.JSONObject('UIMessage', [this.msg, this.date] ); });
	json.revivers.UIMessage    = (function(value) { return new UIMessage(value[0], value[1]); });

...and then use it easily:

	// Test for the object
	var data = new UIMessage("Hello World!");
	console.log("data = " + sys.inspect(data));
	
	var str = json.stringify(data);
	console.log("str = " + sys.inspect(str));
	
	var parsed_data = json.parse(str);
	console.log("parsed_data = " + sys.inspect(parsed_data));
