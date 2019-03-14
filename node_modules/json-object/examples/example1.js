console.log("String.prototype.toJSON: " + ( String.prototype.toJSON ? "exists" : "does not exist") );
console.log("Error.prototype.toJSON: " + ( Error.prototype.toJSON ? "exists" : "does not exist") );

var json = require('json-object').setup(global),
    sys = require('sys');

var data = {'date':new Date(),'msg':'Hello World!'};
console.log("data = " + sys.inspect(data));

var str = json.stringify(data);
console.log("str = " + sys.inspect(str));

var parsed_data = json.parse(str);
console.log("parsed_data = " + sys.inspect(parsed_data));

console.log("String.prototype.toJSON: " + ( String.prototype.toJSON ? "exists" : "does not exist") );
console.log("Error.prototype.toJSON: " + ( Error.prototype.toJSON ? "exists" : "does not exist") );
