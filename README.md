![NpmVersion](https://img.shields.io/npm/v/@gjax/uri.svg)
[![npm](https://img.shields.io/npm/dm/@gjax/uri.svg)](https://www.npmjs.com/package/@gjax/uri)
[![Build Status](https://travis-ci.org/gratex/uri.svg?branch=readme)](https://travis-ci.org/gratex/uri)
[![Coverage Status](https://coveralls.io/repos/github/gratex/uri/badge.svg?branch=readme)](https://coveralls.io/github/gratex/uri?branch=readme)
![NodeVersion](https://img.shields.io/node/v/@gjax/uri.svg)
![npm type definitions](https://img.shields.io/npm/types/@gjax/uri.svg)


# Convenient URI API


## Installation

Using npm:

```
npm install @gjax/uri
```

## API

See [API Documentation](http://gratex.github.io/uri/doc/api/index.html) for full list of methods and modules.

### *Uri* - high-level API

Provides methods for safe URL manipulation.

Example:
```
const { Uri } = require('@gjax/uri');

const code = 'john/doe';
const url = Uri.appendSegments('/my/sample/', 'collection', code); // '/my/sample/collection/john%2Fdoe'  
```

### *uri* - low-level API

Provides methods which are used by *Uri* implematation but can also be used directly.
(like: decompising/recomposing components, encoding single URI parts, etc.)

Example:
```
const { uri } = require('@gjax/uri');
const res = uri.encodeQuery('foo#bar'); // 'foo%23bar'
```

### URI builder tags

ES6 template literal tags & utils used for building URL strings with correct encoding.

Example:
```
const { uriBuilder } = require('@gjax/uri');
const p1 = 'a/b?c', p2 = 'a#b', p3 = 'a b';  
const url = uriBuilder`/foo/${p1}/bar/?x=${p2}#/baz/${p3}`; // '/foo/a%2Fb%3Fc/bar/?x=a%23b#/baz/a%20b'
```

## Using with webpack and babel

This module is written using latest ES features (supported in node>=8.6.0) and also requires native node module *querystring*.

If this module is going to be used in older node or in browser it needs to be compiled (e.g. using babel) and a polyfill for *querystring* needs to be provided.

### Sample configuration for webpack

Install dependencies:
```
npm i -D babel-core babel-loader babel-preset-es2015 babel-plugin-transform-object-rest-spread
```

Configure *querystring* polyfill in webpack config:
(https://webpack.js.org/configuration/node/)
```
node: {
  querystring: true
}
```

Configure babel compilation:
```
module: {
  rules: [
    {
      test: /node_modules[\/\\]@gjax.*\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015'],
        plugins: [require('babel-plugin-transform-object-rest-spread')]
      }
    }
    ...
```
