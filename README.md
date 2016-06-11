# ajv-keywords

Custom JSON-Schema keywords for [ajv](https://github.com/epoberezkin/ajv) validator

[![Build Status](https://travis-ci.org/epoberezkin/ajv-keywords.svg?branch=master)](https://travis-ci.org/epoberezkin/ajv-keywords)
[![npm version](https://badge.fury.io/js/ajv-keywords.svg)](https://www.npmjs.com/package/ajv-keywords)
[![Coverage Status](https://coveralls.io/repos/epoberezkin/ajv-keywords/badge.svg?branch=master&service=github)](https://coveralls.io/github/epoberezkin/ajv-keywords?branch=master)


## Install

```
npm install ajv-keywords
```


## Usage

```javascript
var Ajv = require('ajv');
var defineKeywords = require('ajv-keywords');

var ajv = new Ajv;
defineKeywords(ajv, 'instanceof');

ajv.validate({ instanceof: 'RegExp' }, /.*/); // true
ajv.validate({ instanceof: 'RegExp' }, '.*'); // false
```

or if using in browser (to avoid adding unused code):

```javascript
var Ajv = require('ajv');
var ajv = new Ajv;
var instanceofDefinition = require('ajv-keywords/keywords/instanceof')
ajv.addKeyword('instanceof', instanceofDefinition);
```


## Keywords

### `typeof`

Based on JavaScript `typeof` operation.

The value of the keyword should be a string (`"undefined"`, `"string"`, `"number"`, `"object"`, `"function"`, `"boolean"` or `"symbol"`) or array of strings.

To pass validation the result of `typeof` operation on the value should be equal to the string (or one of the strings in the array).

```
ajv.validate({ typeof: 'undefined' }, undefined); // true
ajv.validate({ typeof: 'undefined' }, null); // false
ajv.validate({ typeof: ['undefined', 'object'] }, null); // true
```


### `instanceof`

Based on JavaScript `typeof` operation.

The value of the keyword should be a string (`"Object"`, `"Array"`, `"Function"`, `"Number"`, `"String"`, `"Date"`, `"RegExp"` or `"Buffer"`) or array of strings.

To pass validation the result of `data instanceof ...` operation on the value should be true:

```
ajv.validate({ instanceof: 'Array' }, []); // true
ajv.validate({ instanceof: 'Array' }, {}); // false
ajv.validate({ instanceof: ['Array', 'Function'] }, funciton(){}); // true
```

You can add your own constructor function to be recognised by this keyword:

```javascript
function MyClass() {}
instanceofDefinition.CONSTRUCTORS.MyClass = MyClass;

ajv.validate({ instanceof: 'MyClass' }, new MyClass); // true
```


## `range` and `exclusiveRange`

Syntax sugar for the combination of minimum and maximum keywords, also fails schema compilation if there are no numbers in the range.

The value of this keyword must be the array consisting of two numbers, the second must be greater or equal than the first one.

If the validated value is not a number the validation passes, otherwise to pas validation the value should be greater (or equal) than the first number and smaller (or equal) than the second number in the array. If `exclusiveRange` keyword is present in the same schema and its value is true, the validated value must not be equal to the range boundaries.

```javascript
var schema = { range: [1, 3] };
ajv.validate(schema, 1); // true
ajv.validate(schema, 2); // true
ajv.validate(schema, 3); // true
ajv.validate(schema, 0.99); // false
ajv.validate(schema, 3.01); // false

var schema = { range: [1, 3], exclusiveRange: true };
ajv.validate(schema, 1.01); // true
ajv.validate(schema, 2); // true
ajv.validate(schema, 2.99); // true
ajv.validate(schema, 1); // false
ajv.validate(schema, 3); // false
```


## License

[MIT](https://github.com/JSONScript/ajv-keywords/blob/master/LICENSE)
