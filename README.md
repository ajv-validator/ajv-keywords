# ajv-keywords

Custom JSON-Schema keywords for [ajv](https://github.com/epoberezkin/ajv) validator

[![Build Status](https://travis-ci.org/epoberezkin/ajv-keywords.svg?branch=master)](https://travis-ci.org/epoberezkin/ajv-keywords)
[![npm version](https://badge.fury.io/js/ajv-keywords.svg)](https://www.npmjs.com/package/ajv-keywords)


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

The value of the keyword should be a string: `"undefined"`, `"string"`, `"number"`, `"object"`, `"function"`, `"boolean"` or `"symbol"`.

To pass validation the result of `typeof` operation on the value should be equal to the string.

```
ajv.validate({ typeof: 'undefined' }, undefined); // true
ajv.validate({ typeof: 'undefined' }, null); // false
```


### `instanceof`

Based on JavaScript `typeof` operation.

The value of the keyword should be a string: `"Object"`, `"Array"`, `"Function"`, `"Number"`, `"String"`, `"Date"`, `"RegExp"` or `"Buffer"`.

To pass validation the result of `data instanceof ...` operation on the value should be true:

```
ajv.validate({ instanceof: 'Array' }, []); // true
ajv.validate({ instanceof: 'Array' }, {}); // false
```

You can add your own constructor function to be recognised by this keyword:

```javascript
function MyClass() {}
instanceofDefinition.CONSTRUCTORS.MyClass = MyClass;

ajv.validate({ instanceof: 'MyClass' }, new MyClass); // true
```


## License

[MIT](https://github.com/JSONScript/ajv-keywords/blob/master/LICENSE)
