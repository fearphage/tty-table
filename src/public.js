var Merge = require("merge");
//var Format = require('./format.js');
var Render = require('./render.js');

//table body inherits from Array
var Cls = Object.create(Array.prototype);

//make sure config is unique for each export
var Config; 

/**
* @class Table
* @param {array} header													- [See example](#example-usage)
* @param {object} header.column									- Column options
* @param {string} header.column.alias						- Alernate header column name
* @param {string} header.column.align						- default: "center"
* @param {string} header.column.color						- default: terminal default color
* @param {string} header.column.footerAlign			- default: "center" 
* @param {string} header.column.footerColor			- default: terminal default color
* @param {function} header.column.formatter			- Runs a callback on each cell value in the parent column
* @param {string} header.column.headerAlign			- default: "center" 
* @param {string} header.column.headerColor			- default: terminal's default color
* @param {number} header.column.marginLeft			- default: 0
* @param {number} header.column.marginTop				- default: 0			
* @param {number} header.column.maxWidth				- default: 20 
* @param {number} header.column.paddingBottom		- default: 0
* @param {number} header.column.paddingLeft			- default: 0
* @param {number} header.column.paddingRight		- default: 0
* @param {number} header.column.paddingTop			- default: 0	
*
* @param {array} rows											- [See example](#example-usage)
*
* @param {object} options									- Table options 
* @param {number} options.borderStyle			- default: 1 (0 = no border) 
* Refers to the index of the desired character set. 
* @param {array} options.borderCharacters	- [See @note](#note) 
* @param {string} options.borderColor			- default: terminal's default color
* @param {mixed} options.defaultErrorValue - default: 'ERROR!'
* @param {mixed} options.defaultValue - default: '?'
* @param {boolean} options.errorOnNull		- default: false

* @returns {Table}
* @note
* <a name="note"/>
* Default border character sets:
* ```
*	[
*		[
*			{v: " ", l: " ", j: " ", h: " ", r: " "},
*			{v: " ", l: " ", j: " ", h: " ", r: " "},
*			{v: " ", l: " ", j: " ", h: " ", r: " "}
*		],
*		[
*			{v: "│", l: "┌", j: "┬", h: "─", r: "┐"},
*			{v: "│", l: "├", j: "┼", h: "─", r: "┤"},
*			{v: "│", l: "└", j: "┴", h: "─", r: "┘"}
*		],
*		[
*			{v: "|", l: "+", j: "+", h: "-", r: "+"},
*			{v: "|", l: "+", j: "+", h: "-", r: "+"},
*			{v: "|", l: "+", j: "+", h: "-", r: "+"}
*		]
*	]
* ```
* @example
* ```
* var Table = require('tty-table');
* var t1 = Table(header,rows,options);
* console.log(t1.render()); 
* ```
*
*/
Cls.setup = function(){

	Config = require('./config.js');
	
	var data = Cls;

	var	options = (typeof arguments[3] === 'object') ? arguments[3] : 
			(typeof arguments[2] === 'object') ? arguments[2] : {};

	Config = Merge(true,Config,options);

	//backfixes for shortened option names
	Config.align = Config.alignment || Config.align;
	
	Config.headerAlign = Config.headerAlignment || Config.headerAlign;

	if(arguments[0] && arguments[0] instanceof Array && arguments[0].length){
		Config.table.header = arguments[0]; 
	}
	else{
		Config.table.header = []; 
		Config.headerEmpty = true;
	}

	//save a copy for merging columnSettings into cell options
	Config.columnSettings = Config.table.header.slice(0); 

	//if borderColor is called, lets do it now
	if(Config.borderColor !== null){
		var Chalk = require('chalk')
		
		Config.borderCharacters[Config.borderStyle] = 
			Config.borderCharacters[Config.borderStyle].map(function(obj){
				Object.keys(obj).forEach(function(key){
					 obj[key] = Chalk[Config.borderColor](obj[key]);
				})
				return obj;
			});
	}

	//match header geometry with body array	
	Config.table.header = [Config.table.header];
	
	//pushed body data into instance prototype
	if(arguments[1] && arguments[1] instanceof Array){
		arguments[1].forEach(function(val){
			data.push(val);
		});
	}	

	Config.table.footer = (arguments[2] instanceof Array) ? arguments[2] : [];
	
	return data;
}


/**
 * Renders a table to a string
 * @returns {String}
 * @memberof Table 
 * @example 
 * ```
 * var str = t1.render(); 
 * console.log(str); //outputs table
 * ```
*/
Cls.render = function(){
	
	var data = this;

	//get sring output
	var output = Render.stringifyData.call(this,Config,data);

	return output;
}	

module.exports = Cls;
